provider "helm" {
  kubernetes {
    host                   = aws_eks_cluster.main.endpoint
    cluster_ca_certificate = base64decode(
      aws_eks_cluster.main.certificate_authority[0].data
    )
    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
      command     = "aws"
    }
  }
}

resource "helm_release" "nginx_ingress" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true
  wait             = true
  timeout          = 300
  depends_on       = [aws_eks_node_group.main]
}

resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
  wait             = true
  timeout          = 300

  set {
    name  = "server.service.type"
    value = "LoadBalancer"
  }

  depends_on = [aws_eks_node_group.main]
}

# GitHub credentials secret for ArgoCD — automatic, no manual CLI needed
resource "kubernetes_secret" "argocd_github" {
  metadata {
    name      = "github-creds"
    namespace = "argocd"
    labels = {
      "argocd.argoproj.io/secret-type" = "repository"
    }
  }

  data = {
    type     = "git"
    url      = "https://github.com/Gomo23/dayplanner.git"
    username = "Gomo23"
    password = local.github_token    # ← reads from Secrets Manager
  }

  depends_on = [helm_release.argocd]
}

resource "helm_release" "argocd_app" {
  name      = "dayplanner-app"
  chart     = "${path.module}/../helm/argocd-app"
  namespace = "argocd"
  wait      = false
  depends_on = [
    helm_release.argocd,
    kubernetes_secret.argocd_github
  ]
}
# Wait for ArgoCD to fully sync before Jenkins triggers
resource "null_resource" "wait_for_argocd" {
  depends_on = [helm_release.argocd_app]

  provisioner "local-exec" {
    interpreter = ["/bin/bash", "-c"]
    command = "echo 'Waiting for ArgoCD to sync...' && sleep 60 && aws eks update-kubeconfig --region ${var.aws_region} --name ${var.cluster_name} && kubectl wait --for=condition=available deployment/argocd-server -n argocd --timeout=300s && echo 'ArgoCD ready'"
  }
}
