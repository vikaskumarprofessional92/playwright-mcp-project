pipeline {
    agent any

    environment {
        NODE_VERSION = '20.11.1'  // Specify the Node.js version you want to use
        NVM_DIR = "${env.HOME}/.nvm"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    // Install nvm if not present
                    sh '''
                        # Install nvm if not present
                        if [ ! -d "$NVM_DIR" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                        fi
                        
                        # Load nvm
                        . "$NVM_DIR/nvm.sh"
                        
                        # Install Node.js if not already installed
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}
                        
                        # Verify installation
                        node --version
                        npm --version
                    '''
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh '''
                        # Load nvm and use the specified Node.js version
                        . "$NVM_DIR/nvm.sh"
                        nvm use ${NODE_VERSION}
                        
                        # Install dependencies
                        npm ci
                        npx playwright install --with-deps chromium
                    '''
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh '''
                        # Load nvm and use the specified Node.js version
                        . "$NVM_DIR/nvm.sh"
                        nvm use ${NODE_VERSION}
                        
                        # Run tests
                        npx playwright test --reporter=html,junit
                    '''
                }
            }
            post {
                always {
                    junit(
                        allowEmptyResults: true,
                        testResults: 'test-results/junit.xml'
                    )
                    publishHTML([
                        allowMissing: true,
                        alwaysLinkToLastBuild: true,
                        keepAll: true,
                        reportDir: 'playwright-report',
                        reportFiles: 'index.html',
                        reportName: 'Playwright Report',
                        reportTitles: 'Playwright Test Results'
                    ])
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}