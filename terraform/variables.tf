k# DELETE these two variables — no longer needed
# variable "jenkins_api_token" { ... }
# variable "github_token" { ... }

# Keep only non-sensitive ones
variable "aws_region" {
  description = "aws region"
  default     = "us-east-2"
}
variable "az_1" {
  default = "us-east-2a"
}
variable "az_2" {
  default = "us-east-2b"
}
variable "cluster_name" {
  default = "dayplanner-eks"
}
variable "vpc_name" {
  default = "dayplanner-vpc"
}
variable "eks_version" {
  default = "1.31"
}
variable "jenkins_url" {
  default = "http://16.59.94.213:8080"
}
variable "jenkins_job" {
  default = "day"
}
variable "jenkins_user" {
  default = "admin"
}
