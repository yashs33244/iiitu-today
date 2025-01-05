pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'my-reddit-clone'
        DOCKER_REGISTRY = 'yashs3324'
        REMOTE_HOST = '13.53.196.171'
        REMOTE_USER = 'ec2-user'
        GITHUB_BRANCH = 'master'
    }
    
    stages {
        stage('Code Checkout') {
            steps {
                git branch: '${GITHUB_BRANCH}',
                    url: 'https://github.com/yashs33244/iiitu-today.git'
            }
        }
        
        stage('Test') {
            steps {
                sh 'echo "Running tests..."'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build on worker node
                    sh """
                        docker build -t ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest .
                    """
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', 
                                                    passwordVariable: 'DOCKER_PASSWORD', 
                                                    usernameVariable: 'DOCKER_USERNAME')]) {
                        sh """
                            echo ${DOCKER_PASSWORD} | docker login -u ${DOCKER_USERNAME} --password-stdin
                            docker push ${DOCKER_REGISTRY}/${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                script {
                    sshagent(['jenkins-ssh-key']) {
                        sh """
                            ssh -o StrictHostKeyChecking=no ${REMOTE_USER}@${REMOTE_HOST} '
                                cd /path/to/your/app
                                
                                # Stop the running containers
                                docker-compose down
                                
                                # Remove old images (keeping volumes intact)
                                docker image prune -f
                                
                                # Pull the latest image
                                docker-compose pull
                                
                                # Start containers with new image
                                docker-compose up -d
                            '
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            sh 'docker logout'
            
            // Clean up old images on worker node
            sh 'docker image prune -f'
        }
    }
}