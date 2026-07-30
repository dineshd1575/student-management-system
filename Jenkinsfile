pipeline {

    agent any

    environment {
        DOCKER_USER = "dineshd1575"
        FRONTEND_IMAGE = "student-frontend"
        BACKEND_IMAGE = "student-backend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend') {
            steps {
                sh """
                docker build --no-cache \
                -t ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG} \
                ./frontend
                """
            }
        }

        stage('Build Backend') {
            steps {
                sh """
                docker build --no-cache \
                -t ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG} \
                ./backend
                """
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_PASSWORD'
                    )
                ]) {
                    sh '''
                    echo "$DOCKER_PASSWORD" | docker login \
                    -u "$DOCKER_USERNAME" \
                    --password-stdin
                    '''
                }
            }
        }

        stage('Push Images') {
            steps {
                sh """
                docker push ${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}
                docker push ${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}
                """
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh """
                kubectl set image deployment/frontend-deployment \
                frontend=${DOCKER_USER}/${FRONTEND_IMAGE}:${IMAGE_TAG}

                kubectl set image deployment/backend-deployment \
                backend=${DOCKER_USER}/${BACKEND_IMAGE}:${IMAGE_TAG}

                kubectl rollout restart deployment/frontend-deployment
                kubectl rollout restart deployment/backend-deployment
                """
            }
        }

        stage('Wait for Rollout') {
            steps {
                sh """
                kubectl rollout status deployment/frontend-deployment
                kubectl rollout status deployment/backend-deployment
                """
            }
        }

        stage('Verify') {
            steps {
                sh """
                kubectl get deployments
                kubectl get pods -o wide
                kubectl get svc
                """
            }
        }
    }

    post {

        success {
            echo "======================================"
            echo "CI/CD Pipeline Completed Successfully"
            echo "======================================"
            sh "docker image prune -f"
        }

        failure {
            echo "======================================"
            echo "Pipeline Failed"
            echo "======================================"
        }
    }
}
