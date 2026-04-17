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
    aws_db_instance.postgres,
    aws_ecr_repository.backend,
    aws_ecr_repository.frontend
  ]

  provisioner "local-exec" {
    command = <<-EOT
      CRUMB=$(curl -s -u "${var.jenkins_user}:${var.jenkins_api_token}" \
        "${var.jenkins_url}/crumbIssuer/api/json" \
        | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['crumbRequestField'] + ':' + d['crumb'])")

      curl -X POST "${var.jenkins_url}/job/${var.jenkins_job}/build" \
        -u "${var.jenkins_user}:${var.jenkins_api_token}" \
        -H "$CRUMB"
    EOT
  }
}
