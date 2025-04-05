pipeline {
    agent any

    tools {
        nodejs 'Node.js 20.x'
    }

    options {
        ansiColor('xterm')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
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