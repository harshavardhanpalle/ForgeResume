pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'harshapalle',
                    url: 'https://github.com/harshavardhanpalle/ForgeResume.git'
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@52.66.208.40 "mkdir -p /tmp/forge-resume"

                    scp -o StrictHostKeyChecking=no -r forge-resume/* \
                    ubuntu@52.66.208.40:/tmp/forge-resume/

                    ssh -o StrictHostKeyChecking=no ubuntu@52.66.208.40 "
                        sudo rm -rf /var/www/html/* &&
                        sudo cp -r /tmp/forge-resume/* /var/www/html/ &&
                        sudo systemctl reload nginx
                    "
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Deployment Successful'
        }
        failure {
            echo 'Deployment Failed'
        }
    }
}
