resource "aws_ecr_repository" "backend" {
  name         = "dayplanner-backend"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "frontend" {
  name         = "dayplanner-frontend"
  force_delete = true
  image_scanning_configuration {
    scan_on_push = true
  }
}

# Trigger Jenkins after all infra ready
# Jenkins builds → pushes to ECR → updates k8s yaml → ArgoCD depl
resource "null_resource" "trigger_jenkins" {
  depends_on = [
    helm_release.nginx_ingress,
    helm_release.argocd_app,
    null_resource.wait_for_argocd,
    helm_release.prometheus,        # ← ADD THIS
    aws_db_instance.postgres,
    aws_ecr_repository.backend,
    aws_ecr_repository.frontend
  ]

  provisioner "local-exec" {
    command = "${path.module}/trigger_jenkins.sh '${var.jenkins_url}' '${var.jenkins_job}' '${var.jenkins_user}' '${local.jenkins_api_token}'"
    interpreter = ["/bin/bash", "-c"]
  }
}
