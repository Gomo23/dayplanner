variable "aws_region" {
  description = "aws region"
  default     = "us-east-2"
}

variable "az_1" {
  description = "availability zone 1"
  default     = "us-east-2a"
}

variable "az_2" {
  description = "availability zone 2"
  default     = "us-east-2b"
}

variable "cluster_name" {
  description = "EKS cluster name"
  default     = "dayplanner-eks"
}

variable "vpc_name" {
  description = "vpc name"
  default     = "dayplanner-vpc"
}

variable "eks_version" {
  description = "eks version"
  default     = "1.31"
}

variable "jenkins_url" {
  description = "Jenkins server URL"
  default     = "http://16.59.94.213:8080"
}
variable "jenkins_job" {
  description = "Jenkins job name"
  default     = "day"
}


