provider "helm" {
   kubernetes {
    host = aws_eks_cluster.main.endpoint

    cluster_ca_certificate = base64decode(
      aws_eks_cluster.main.certificate_authority[0].data
    )

    exec {
      api_version = "client.authentication.k8s.io/v1beta1"
      command     = "aws"
      args        = ["eks", "get-token", "--cluster-name", var.cluster_name]
    }
  }
}

resource "helm_release" "nginx_ingress" {
  name             = "nginx-ingress"
  repository       = "https://kubernetes.github.io/ingress-nginx"
  chart            = "ingress-nginx"
  namespace        = "ingress-nginx"
  create_namespace = true

  depends_on = [aws_eks_node_group.main]
}

resource "helm_release" "dayplanner" {
  name             = "dayplanner"
  chart            = "${path.module}/../helm/dayplanner"
  namespace        = "dayplanner"
  create_namespace = true

  set {
    name  = "backend.env.dbUrl"
    value = "jdbc:postgresql://${aws_db_instance.postgres.endpoint}/dayplanner"
  }

  set {
  name  = "backend.image.repository"
  value = "334894867020.dkr.ecr.us-east-2.amazonaws.com/dayplanner-backend"
}

set {
  name  = "backend.image.tag"
  value = data.aws_ecr_image.backend_latest.image_tags[0]
}

set {
  name  = "frontend.image.repository"
  value = "334894867020.dkr.ecr.us-east-2.amazonaws.com/dayplanner-frontend"
}

set {
  name  = "frontend.image.tag"
value = data.aws_ecr_image.frontend_latest.image_tags[0]}

  depends_on = [
    helm_release.nginx_ingress,
    aws_db_instance.postgres
  ]
}
