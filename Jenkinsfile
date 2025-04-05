pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                script {
                    // Use shell commands to ensure Node.js is available
                    sh 'node --version'
                    sh 'npm --version'
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm ci'
                    sh 'npx playwright install --with-deps chromium'
                }
            }
        }

        stage('Run Tests') {
            steps {
                script {
                    sh 'npx playwright test --reporter=html,junit'
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