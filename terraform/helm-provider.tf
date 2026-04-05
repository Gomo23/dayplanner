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

# Helm only installs Nginx Ingress — NOT the app
# App is deployed by ArgoCD watching GitHub
resource "helm_release" "nginx_ingress" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true
  wait             = true
  timeout          = 300

  depends_on = [aws_eks_node_group.main]
}

# Create dayplanner namespace for ArgoCD to deploy into
resource "kubernetes_namespace" "dayplanner" {
  metadata {
    name = "dayplanner"
  }

  depends_on = [aws_eks_node_group.main]
}
