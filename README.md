# ✦ DayPlanner — Production-Grade Full Stack DevOps Project

> Java 17 · Spring Boot 3.2 · React 18 · PostgreSQL · Docker · Kubernetes · Jenkins · ArgoCD · Terraform · AWS EKS · Prometheus · Grafana

[![CI/CD](https://img.shields.io/badge/CI%2FCD-Jenkins-red?style=flat-square&logo=jenkins)](https://jenkins.io)
[![GitOps](https://img.shields.io/badge/GitOps-ArgoCD-orange?style=flat-square&logo=argo)](https://argoproj.github.io)
[![IaC](https://img.shields.io/badge/IaC-Terraform-purple?style=flat-square&logo=terraform)](https://terraform.io)
[![K8s](https://img.shields.io/badge/Orchestration-EKS-blue?style=flat-square&logo=kubernetes)](https://kubernetes.io)
[![Monitoring](https://img.shields.io/badge/Monitoring-Prometheus%20%2B%20Grafana-yellow?style=flat-square&logo=grafana)](https://grafana.com)
[![Cloud](https://img.shields.io/badge/Cloud-AWS-orange?style=flat-square&logo=amazon-aws)](https://aws.amazon.com)

---

## 📌 What is DayPlanner?

DayPlanner is a full-stack personal productivity application — but more importantly, it is a **complete end-to-end DevOps project** built from scratch. The goal was to learn and implement every layer of a production-grade DevOps pipeline: from local development all the way to Kubernetes on AWS EKS with automated CI/CD, GitOps, Infrastructure as Code, and observability.

**App features:** Task management · Expense tracking · Colourful sticky notes · Dashboard with charts · JWT authentication

---

## 🏗️ Architecture Overview

```
Developer Laptop
      │
      │  git push (main branch)
      ▼
  GitHub (github.com/Gomo23/dayplanner)
      │                          │
      │  Webhook trigger         │  ArgoCD watches
      ▼                          ▼
EC2: Jenkins Server         AWS EKS Cluster (us-east-2)
┌─────────────────┐        ┌──────────────────────────────────────┐
│  Stage 1        │        │  Namespace: dayplanner               │
│  Checkout       │        │  ┌─────────────┐ ┌────────────────┐  │
│                 │        │  │ Backend Pod │ │ Frontend Pod   │  │
│  Stage 2        │        │  │ Spring Boot │ │ React + Nginx  │  │
│  Docker Build   │        │  └─────────────┘ └────────────────┘  │
│                 │        │                                       │
│  Stage 3        │        │  Namespace: argocd                   │
│  Push to ECR ───┼──────▶ │  ┌─────────────────────────────────┐ │
│                 │  ECR   │  │ ArgoCD Server (LoadBalancer)    │ │
│  Stage 4        │        │  └─────────────────────────────────┘ │
│  Update Helm    │        │                                       │
│  values.yaml   │        │  Namespace: ingress-nginx            │
│                 │        │  ┌─────────────────────────────────┐ │
│  Stage 5        │        │  │ Nginx Ingress (LoadBalancer)    │ │
│  Push to GitHub │        │  └─────────────────────────────────┘ │
└─────────────────┘        │                                       │
                            │  Namespace: monitoring               │
                            │  ┌──────────────┐ ┌──────────────┐  │
                            │  │  Prometheus  │ │   Grafana    │  │
                            │  └──────────────┘ └──────────────┘  │
                            └──────────────────────────────────────┘
                                          │
                                    JDBC  │  (private subnet)
                                          ▼
                            AWS RDS PostgreSQL
                            ┌──────────────────┐
                            │  db.t3.micro      │
                            │  Port 5432        │
                            │  VPC access only  │
                            └──────────────────┘

VPC: 10.0.0.0/16
  Public  Subnets: 10.0.3.0/24, 10.0.4.0/24  → EKS nodes, NAT
  Private Subnets: 10.0.1.0/24, 10.0.2.0/24  → RDS
  NAT Gateway → private nodes pull from ECR
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Backend** | Java 17 · Spring Boot 3.2 · Spring Security · JPA/Hibernate |
| **Frontend** | React 18 · React Router · Axios · Recharts |
| **Database** | PostgreSQL 15 → AWS RDS (production) |
| **Auth** | JWT (jjwt 0.11.5) |
| **Containers** | Docker (multi-stage builds) |
| **Registry** | AWS ECR |
| **Orchestration** | Kubernetes — kubeadm (learning) → AWS EKS v1.31 (production) |
| **CI/CD** | Jenkins Pipelines + GitHub Webhooks |
| **GitOps** | ArgoCD + Helm Charts |
| **IaC** | Terraform (VPC · EKS · RDS · ECR · Helm · Secrets Manager) |
| **Ingress** | Nginx Ingress Controller |
| **Monitoring** | Prometheus + Grafana (kube-prometheus-stack) |
| **Secrets** | AWS Secrets Manager |
| **Cloud** | AWS (EC2 · EKS · ECR · RDS · VPC · IAM · ELB · Secrets Manager) |

---

## 📁 Project Structure

```
dayplanner/
├── backend/                          Java Spring Boot API
│   ├── Dockerfile                    Multi-stage: Maven build → JRE runtime (~200MB)
│   ├── .dockerignore
│   ├── pom.xml
│   └── src/main/java/com/dayplanner/
│       ├── config/SecurityConfig.java
│       ├── security/
│       │   ├── JwtUtil.java
│       │   ├── JwtFilter.java
│       │   └── UserDetailsServiceImpl.java   ← separate class fixes circular dependency
│       ├── service/AuthService.java           ← register + login only
│       ├── controller/                        Auth, Task, Expense, Note controllers
│       ├── model/                             User, Task, Expense, Note entities
│       ├── repository/                        JPA repositories
│       └── dto/                               Request/Response DTOs
│
├── frontend/                         React 18 SPA
│   ├── Dockerfile                    Multi-stage: Node build → Nginx (~25MB)
│   ├── nginx.conf                    React Router + /api proxy to backend
│   ├── package.json
│   └── src/
│       ├── theme.js                  Warm colour palette (terracotta/honey/moss)
│       ├── App.js                    Routes: / → /login → /dashboard
│       ├── pages/                    Landing, Login, Register, Dashboard,
│       │                             Tasks, Expenses, Notes
│       └── components/Layout.js      Sidebar navigation
│
├── k8s/                              Raw Kubernetes manifests (kubeadm phase)
│   ├── dayplanner-backend.yaml
│   ├── dayplanner-frontend.yaml
│   ├── dayplanner-db.yaml
│   └── ingress.yaml
│
├── helm/
│   ├── dayplanner/                   Application Helm chart (used by ArgoCD)
│   │   ├── Chart.yaml
│   │   ├── values.yaml               ← Jenkins updates image tag here on every build
│   │   └── templates/
│   │       ├── backend-deployment.yaml
│   │       ├── backend-service.yaml
│   │       ├── frontend-deployment.yaml
│   │       ├── frontend-service.yaml
│   │       └── ingress.yaml
│   └── argocd-app/                   ArgoCD Application Helm chart
│       └── templates/application.yaml
│
├── terraform/                        Infrastructure as Code
│   ├── main.tf                       Provider config (AWS + Helm + Kubernetes)
│   ├── variables.tf
│   ├── vpc.tf                        VPC, subnets, IGW, NAT gateway, routes
│   ├── eks.tf                        IAM roles + EKS cluster + node group
│   ├── ecr.tf                        ECR repos + null_resource Jenkins trigger
│   ├── rds.tf                        RDS PostgreSQL in private subnet
│   ├── helm-provider.tf              Nginx Ingress + ArgoCD + GitHub secret
│   ├── secrets.tf                    Reads GitHub token from AWS Secrets Manager
│   ├── outputs.tf
│   └── .gitignore
│
├── Jenkinsfile                       5-stage CI/CD pipeline
├── setup.sh                          One-command EC2 bootstrap script
└── .gitignore
```

---

## 🚀 CI/CD Pipeline

Every `git push` to `main` triggers the full pipeline automatically via GitHub webhook.

```
git push
    │
    ▼
GitHub Webhook → Jenkins
    │
    ├── Stage 1: Checkout
    │     git clone from GitHub
    │
    ├── Stage 2: Docker Build
    │     docker build -t backend:$BUILD_NUMBER  ./backend
    │     docker build -t frontend:$BUILD_NUMBER ./frontend
    │     (Maven + npm run INSIDE Docker — no separate build stage needed)
    │
    ├── Stage 3: Push to ECR
    │     aws ecr get-login-password | docker login
    │     docker push backend:$BUILD_NUMBER
    │     docker push frontend:$BUILD_NUMBER
    │
    ├── Stage 4: Update Helm values
    │     sed replaces image tag in helm/dayplanner/values.yaml
    │     tag: "21"  ← build number
    │
    └── Stage 5: Push to GitHub
          git commit values.yaml
          git push → triggers ArgoCD sync
              │
              ▼
          ArgoCD detects values.yaml changed
          ArgoCD runs: helm upgrade dayplanner
              │
              ▼
          EKS: backend pod → :21
          EKS: frontend pod → :21
              │
              ▼
          App live at LoadBalancer URL ✓
```

---

## ⚡ Terraform One-Touch Infrastructure

```bash
cd terraform/
terraform init
terraform apply
# type yes — entire production infrastructure created in ~15 minutes
```

**What `terraform apply` creates:**

| Resource | Details |
|---|---|
| VPC | 10.0.0.0/16 with 2 public + 2 private subnets |
| Internet Gateway + NAT | Public internet access + private node ECR pulls |
| EKS Cluster | v1.31, 2 worker nodes (t2.medium) |
| ECR Repositories | dayplanner-backend + dayplanner-frontend |
| RDS PostgreSQL | db.t3.micro, private subnet, 20GB gp2 |
| Nginx Ingress | Installed via Helm, creates AWS LoadBalancer |
| ArgoCD | Installed via Helm, LoadBalancer service |
| GitHub Secret | Auto-created from AWS Secrets Manager token |
| ArgoCD Application | Watches helm/dayplanner/ in GitHub, auto-sync |
| Jenkins Trigger | curl triggers Jenkins after infra ready |

**After apply — connect kubectl:**
```bash
aws eks update-kubeconfig --region us-east-2 --name dayplanner-eks
kubectl get nodes
```

---

## 📊 Monitoring — Prometheus + Grafana

Installed via Helm using kube-prometheus-stack:

```bash
helm repo add prometheus-community \
  https://prometheus-community.github.io/helm-charts
helm repo update

helm install monitoring \
  prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  --create-namespace
```

**Access Grafana:**
```bash
# Get Grafana URL
kubectl get svc -n monitoring | grep grafana

# Default credentials
Username: admin
Password: prom-operator
```

**What is monitored:**
- Kubernetes node CPU, memory, disk usage
- Pod resource consumption across all namespaces
- Spring Boot JVM metrics (heap, GC, threads)
- HTTP request rate, latency, error rate
- Nginx Ingress request metrics

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register new user |
| POST | /api/auth/login | No | Login → JWT token |
| GET | /api/tasks | Yes | Get all tasks |
| POST | /api/tasks | Yes | Create task |
| PUT | /api/tasks/{id} | Yes | Update task |
| PATCH | /api/tasks/{id}/toggle | Yes | Toggle done/pending |
| DELETE | /api/tasks/{id} | Yes | Delete task |
| GET | /api/expenses | Yes | Get all expenses |
| POST | /api/expenses | Yes | Add expense entry |
| DELETE | /api/expenses/{id} | Yes | Delete expense |
| GET | /api/expenses/summary/{year}/{month} | Yes | Monthly summary |
| GET | /api/notes | Yes | Get all notes (pinned first) |
| POST | /api/notes | Yes | Create note |
| PUT | /api/notes/{id} | Yes | Update note |
| DELETE | /api/notes/{id} | Yes | Delete note |

---

## 🖥️ Local Development Setup

### Quick setup (one command)

```bash
chmod +x setup.sh && ./setup.sh
```

### Manual setup

**1. Install dependencies**
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y openjdk-17-jdk maven postgresql postgresql-contrib
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

**2. Setup PostgreSQL**
```bash
sudo systemctl start postgresql
sudo -u postgres psql << SQL
CREATE DATABASE dayplanner;
CREATE USER dayplanner WITH PASSWORD 'dayplanner123';
GRANT ALL PRIVILEGES ON DATABASE dayplanner TO dayplanner;
ALTER DATABASE dayplanner OWNER TO dayplanner;
SQL

# Fix authentication
sudo nano /etc/postgresql/*/main/pg_hba.conf
# Change: local all all peer  →  local all all md5
sudo systemctl restart postgresql
```

**3. Run backend**
```bash
cd backend
mvn spring-boot:run
# Starts on http://localhost:8080
```

**4. Run frontend**
```bash
cd frontend
npm install
npm start
# Opens http://localhost:3000
```

---

## 🐳 Docker (local containers)

```bash
# Create network
docker network create dayplanner-network

# Run PostgreSQL
docker run -d \
  --name dayplanner-db \
  --network dayplanner-network \
  --restart always \
  -e POSTGRES_DB=dayplanner \
  -e POSTGRES_USER=dayplanner \
  -e POSTGRES_PASSWORD=dayplanner123 \
  -v dayplanner-pgdata:/var/lib/postgresql/data \
  postgres:15-alpine

# Build and run backend
docker build -t dayplanner-backend ./backend
docker run -d \
  --name dayplanner-backend \
  --network dayplanner-network \
  --restart always \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://dayplanner-db:5432/dayplanner \
  -e SPRING_DATASOURCE_USERNAME=dayplanner \
  -e SPRING_DATASOURCE_PASSWORD=dayplanner123 \
  -p 8080:8080 \
  dayplanner-backend

# Build and run frontend
docker build -t dayplanner-frontend ./frontend
docker run -d \
  --name dayplanner-frontend \
  --network dayplanner-network \
  --restart always \
  -p 80:80 \
  dayplanner-frontend
```

---

## ☸️ Kubernetes Commands

```bash
# Check cluster
kubectl get nodes
kubectl get pods -n dayplanner
kubectl get pods -n argocd
kubectl get pods -n ingress-nginx
kubectl get pods -n monitoring

# Get app URL
kubectl get svc -n ingress-nginx

# Get ArgoCD URL + password
kubectl get svc argocd-server -n argocd
kubectl get secret argocd-initial-admin-secret \
  -n argocd -o jsonpath="{.data.password}" | base64 -d && echo

# Get Grafana URL
kubectl get svc -n monitoring | grep grafana

# Check ArgoCD sync status
kubectl get application -n argocd

# Force ArgoCD sync
kubectl patch application dayplanner -n argocd \
  --type merge -p '{"operation":{"sync":{"revision":"HEAD"}}}'

# Debug failing pod
kubectl describe pod <pod-name> -n dayplanner | tail -20
kubectl logs <pod-name> -n dayplanner
```

---

## 🔑 Secrets Management

All secrets stored in AWS Secrets Manager — nothing hardcoded in code or pipelines.

```bash
# Store secrets (one time only)
aws secretsmanager create-secret \
  --name dayplanner/github-token \
  --secret-string "your-github-pat" \
  --region us-east-2

# Terraform reads automatically via secrets.tf
# Jenkins reads via IAM instance role
# No manual credential passing ever needed
```

---
