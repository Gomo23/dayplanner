terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }

    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

data "aws_ecr_image" "backend_latest" {
  repository_name = "dayplanner-backend"
  most_recent     = true
}

data "aws_ecr_image" "frontend_latest" {
  repository_name = "dayplanner-frontend"
  most_recent     = true
}
