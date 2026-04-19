# Read GitHub token from Secrets Manager
data "aws_secretsmanager_secret_version" "github_token" {
  secret_id = "dayplanner/github-token"
}
# Read AWS access key (for Jenkins)
data "aws_secretsmanager_secret_version" "aws_access_key" {
  secret_id = "dayplanner/aws-access-key"
}
data "aws_secretsmanager_secret_version" "aws_secret_key" {
  secret_id = "dayplanner/aws-secret-key"
}

# --- ADD THIS ---
data "aws_secretsmanager_secret_version" "jenkins_api_token" {
  secret_id = "dayplanner/jenkins_api_token"
}

# Local values — use these everywhere in Terraform
locals {
  github_token      = data.aws_secretsmanager_secret_version.github_token.secret_string
  aws_access_key    = data.aws_secretsmanager_secret_version.aws_access_key.secret_string
  aws_secret_key    = data.aws_secretsmanager_secret_version.aws_secret_key.secret_string
  jenkins_api_token = data.aws_secretsmanager_secret_version.jenkins_api_token.secret_string  # ← ADD
}

# Read DB credentials from Secrets Manager
data "aws_secretsmanager_secret_version" "db_username" {
  secret_id = "dayplanner/db_username"
}

data "aws_secretsmanager_secret_version" "db_password" {
  secret_id = "dayplanner/db_password"
}

# Create db-credentials Kubernetes secret in dayplanner namespace
resource "kubernetes_secret" "db_credentials_helm" {
  metadata {
    name      = "db-credentials"
    namespace = "dayplanner"
  }

  data = {
    username = data.aws_secretsmanager_secret_version.db_username.secret_string
    password = data.aws_secretsmanager_secret_version.db_password.secret_string
  }

  depends_on = [helm_release.argocd_app]
}

# Create db-credentials Kubernetes secret in dayplanner-k8s namespace
resource "kubernetes_secret" "db_credentials_k8s" {
  metadata {
    name      = "db-credentials"
    namespace = "dayplanner-k8s"
  }

  data = {
    username = data.aws_secretsmanager_secret_version.db_username.secret_string
    password = data.aws_secretsmanager_secret_version.db_password.secret_string
  }

  depends_on = [helm_release.argocd_app]
}
