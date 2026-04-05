# Security group for RDS
resource "aws_security_group" "rds" {
  name   = "dayplanner-rds-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 5432
    to_port     = 5432
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]  # only from inside VPC
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "dayplanner-rds-sg"
  }
}

# RDS subnet group — needs 2 subnets in different AZs
resource "aws_db_subnet_group" "main" {
  name       = "dayplanner-db-subnet-group"
  subnet_ids = [
    aws_subnet.private_subnet_1.id,
    aws_subnet.private_subnet_2.id
  ]

  tags = {
    Name = "dayplanner-db-subnet-group"
  }
}

# RDS PostgreSQL instance
resource "aws_db_instance" "postgres" {
  identifier        = "dayplanner-postgres"
  engine            = "postgres"
  engine_version    = "15"
  instance_class    = "db.t3.micro"
  allocated_storage = 20
  storage_type      = "gp2"

  db_name  = "dayplanner"
  username = "dayplanner"
  password = "dayplanner123"

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  publicly_accessible = false
  skip_final_snapshot = true

  tags = {
    Name = "dayplanner-postgres"
  }
}