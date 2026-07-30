pipeline {

    agent any

    environment {
        DOCKER_USER = "dineshd1575"
        FRONTEND_IMAGE = "student-frontend"
        BACKEND_IMAGE = "student-backend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/dineshd1575/student-management-system.git'
            }
        }

        stage('Build Frontend Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG ./frontend
                '''
            }
        }

        stage('Build Backend Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG ./backend
                '''
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'USERNAME',
                        passwordVariable: 'PASSWORD'
                    )
                ]) {
                    sh '''
                    echo $PASSWORD | docker login -u $USERNAME --password-stdin
                    '''
                }
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh '''
                docker push $DOCKER_USER/$FRONTEND_IMAGE:$IMAGE_TAG
                '''
            }
        }

        stage('Push Backend Image') {
            steps {
                sh '''
                docker push $DOCKER_USER/$BACKEND_IMAGE:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                kubectl set image deployment/frontend-deployment \
                frontend=dineshd1575/student-frontend:$IMAGE_TAG

                kubectl set image deployment/backend-deployment \
                backend=dineshd1575/student-backend:$IMAGE_TAG
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                sh '''
                kubectl rollout status deployment/frontend-deployment
                kubectl rollout status deployment/backend-deployment

                kubectl get pods
                kubectl get svc
                '''
            }
        }

    }

    post {

        success {
            echo "======================================"
            echo "CI/CD Pipeline Completed Successfully"
            echo "Application Deployed to Kubernetes"
            echo "======================================"
        }

        failure {
            echo "======================================"
            echo "Pipeline Failed!"
            echo "Check Jenkins Console Output"
            echo "======================================"
        }

    }

}
