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

# Local values — use these everywhere in Terraform
locals {
  github_token   = data.aws_secretsmanager_secret_version.github_token.secret_string
  aws_access_key = data.aws_secretsmanager_secret_version.aws_access_key.secret_string
  aws_secret_key = data.aws_secretsmanager_secret_version.aws_secret_key.secret_string
}
