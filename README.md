# Containerized-Application-Deployment on AWS ECS

This project demonstrates a complete, automated CI/CD pipeline for deploying a containerized **Node.js web application** to **AWS ECS Fargate**.  
The entire infrastructure is provisioned using **Terraform (Infrastructure as Code)**, and deployments are automated using **GitHub Actions**.

---

## 🏛️ Architecture Diagram

The architecture is designed for automation, scalability, and security.  
When a developer pushes code to the main branch on GitHub, a CI/CD pipeline is triggered automatically.  
This pipeline builds a new Docker image, pushes it to a private container registry (ECR), and deploys the new version to the ECS cluster without any manual intervention.  
An Application Load Balancer manages and routes public traffic to the healthy containers.
```
+-----------+       +----------------+       +----------------------+
|           |-----> |                |-----> |                      |
| Developer |       |  GitHub Repo   |       |    GitHub Actions    |
|           |       |  (Code Push)   |       |   (CI/CD Pipeline)   |
+-----------+       +----------------+       +----------------------+
                                                     |
                                                     | 1. Build & Push Image
                                                     v
                                             +----------------+
                                             |                |
                                             |  Amazon ECR    |
                                             | (Docker Images)|
                                             +----------------+
                                                     |
                                                     | 2. Deploy New Version
                                                     v
+-----------+       +----------------+       +----------------------+       +----------------+
|           | <---- |                | <---- |                      | <---- |                |
| End User  |       | Application    |       |  AWS ECS on Fargate  |       |  CloudWatch    |
|           |       | Load Balancer  |       | (Running Containers) |       |  (Logs)        |
+-----------+       +----------------+       +----------------------+       +----------------+

```
---

## ⚙️ Workflow

1. **Code Push:**  
   A developer pushes code changes to the main branch of the GitHub repository.

2. **CI/CD Trigger:**  
   The push triggers the GitHub Actions workflow.

3. **Build & Push:**  
   The workflow builds the application into a Docker image and pushes the new image to a private Amazon ECR repository.

4. **Deploy:**  
   The workflow updates the ECS service with a new task definition pointing to the newly uploaded image.

5. **Service Update:**  
   ECS Fargate performs a rolling deployment, draining old connections and starting a new container with the updated image to ensure zero downtime.

6. **Traffic Serving:**  
   The Application Load Balancer (ALB) automatically routes traffic to the new, healthy container.

7. **Monitoring:**  
   Application logs are streamed directly to AWS CloudWatch for real-time monitoring and debugging.

---

## 🛠️ Tech Stack Justification

| Component           | Technology        | Justification |
|---------------------|-------------------|-------------|
| Cloud Provider      | AWS              | Chosen for its robust and mature ecosystem for cloud-native applications, extensive documentation, and the availability of a generous free tier for key services. |
| IaC (Infrastructure as Code) | Terraform | Preferred over CloudFormation for its cloud-agnostic nature, simpler syntax (HCL), and strong state management capabilities, making infrastructure reproducible and easy to manage. |
| Containerization    | Docker           | The industry standard for containerization. It allows packaging the application and its dependencies into a lightweight, portable container that runs consistently everywhere. |
| Orchestration       | AWS ECS on Fargate | Selected for its simplicity and serverless nature. Fargate removes the operational overhead of managing EC2 instances, allowing us to focus solely on the application. |
| CI/CD Automation    | GitHub Actions    | Chosen for its seamless integration with the source code repository. It provides a powerful, event-driven automation platform directly within the development workflow. |
| Application         | Node.js (Express) | A lightweight and efficient framework, ideal for building a simple web application. Its non-blocking I/O makes it suitable for containerized microservices. |
| Logging / Monitoring | AWS CloudWatch  | The native AWS solution for logging and monitoring. It integrates automatically with ECS, providing an easy way to collect, view, and analyze application logs without extra setup. |

---

## 🚀 Steps to Deploy & Test

1️⃣ **Clone the Repository:**
```
git clone <your-repository-url>
cd <repository-name>

## 🚀 Deployment Steps (Continued)

2️⃣ Provision Infrastructure with Terraform:

``` 
cd /iac
terraform init
terraform plan
terraform apply
 When prompted, type yes.
 Note the load_balancer_dns output upon completion. bash

3️⃣ Configure GitHub Secrets for CI/CD:

In AWS account, create an IAM user with programmatic access and attach the GitHub-Actions-Deploy-Policy defined in the project.

Generate an Access Key ID and Secret Access Key for this user.

In GitHub repository → Settings → Secrets and variables → Actions, add:

AWS_ACCESS_KEY_ID: Your IAM User Access Key ID

AWS_SECRET_ACCESS_KEY: Your IAM User Secret Access Key

4️⃣ Trigger the Deployment:

Make a small change in the application code (e.g., edit text in /app/welcome.ejs).

git add .
git commit -m "Triggering deployment"
git push origin main


The deployment will start automatically.

Monitor progress under the Actions tab in your GitHub repository.

🔑 Demo Account

The deployed application includes a mandatory demo login for validation purposes:

Email: hire-me@anshumat.org

Password: HireMe@2025!

👉 Access the live application at:
http://<load_balancer_dns>
(Replace <load_balancer_dns> with the actual DNS provided by Terraform output)
