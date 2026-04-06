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

# 1. Nginx Ingress Controller
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

# 2. ArgoCD
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

# 3. ArgoCD Application — connects GitHub to EKS automatically
resource "helm_release" "argocd_app" {
  name      = "dayplanner-app"
  chart     = "${path.module}/../helm/argocd-app"
  namespace = "argocd"
  wait      = false

  depends_on = [helm_release.argocd]
}
