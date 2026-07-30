pipeline {

    agent any

    environment {

        DOCKER_USER = "dineshd1575"
        FRONTEND_IMAGE = "student-frontend"
        BACKEND_IMAGE = "student-backend"

    }

    stages {

        stage('Clone Repository') {

            steps {

                git branch: 'main',
                url: 'https://github.com/dineshd1575/student-management-system.git'

            }

        }

        stage('Build Frontend') {

            steps {

                sh 'docker build -t $DOCKER_USER/$FRONTEND_IMAGE:v1 ./frontend'

            }

        }

        stage('Build Backend') {

            steps {

                sh 'docker build -t $DOCKER_USER/$BACKEND_IMAGE:v1 ./backend'

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

                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'

                }

            }

        }

        stage('Push Frontend') {

            steps {

                sh 'docker push $DOCKER_USER/$FRONTEND_IMAGE:v1'

            }

        }

        stage('Push Backend') {

            steps {

                sh 'docker push $DOCKER_USER/$BACKEND_IMAGE:v1'

            }

        }

        stage('Deploy Kubernetes') {

            steps {

                sh 'kubectl apply -f k8s/'

            }

        }

        stage('Verify Deployment') {

            steps {

                sh 'kubectl get pods -n student-management'
                sh 'kubectl get svc -n student-management'

            }

        }

    }

}
