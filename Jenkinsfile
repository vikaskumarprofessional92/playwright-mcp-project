pipeline {
    agent any

    // Trigger builds on push and daily at midnight
    triggers {
        pollSCM('H/15 * * * *')  // Poll repo every 15 minutes for changes
        cron('0 0 * * *')        // Run daily at midnight
    }

    options {
        // Keep build logs and artifacts for 10 days
        buildDiscarder(logRotator(daysToKeepStr: '10'))
        // Timeout if build takes more than 1 hour
        timeout(time: 1, unit: 'HOURS')
    }

    environment {
        NODE_VERSION = '20.11.1'
        NVM_DIR = "${env.HOME}/.nvm"
        SLACK_CHANNEL = '#test-automation'
        EMAIL_RECIPIENTS = 'team@company.com'
        // Use credentials
        SLACK_TOKEN = credentials('slack-token')
        EMAIL_AUTH = credentials('email-auth')
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
                    sh '''
                        if [ ! -d "$NVM_DIR" ]; then
                            curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
                        fi
                        . "$NVM_DIR/nvm.sh"
                        nvm install ${NODE_VERSION}
                        nvm use ${NODE_VERSION}
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
                        . "$NVM_DIR/nvm.sh"
                        nvm use ${NODE_VERSION}
                        npm ci
                        # Install all required browsers
                        npx playwright install --with-deps chromium firefox webkit
                    '''
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('API Tests') {
                    steps {
                        script {
                            try {
                                sh '''
                                    . "$NVM_DIR/nvm.sh"
                                    nvm use ${NODE_VERSION}
                                    npx playwright test --project=api-tests
                                '''
                            } finally {
                                junit(
                                    allowEmptyResults: true,
                                    testResults: '**/test-results/api-tests/junit-*.xml'
                                )
                            }
                        }
                    }
                }
                
                stage('Desktop Browser Tests') {
                    parallel {
                        stage('Chrome Tests') {
                            steps {
                                script {
                                    try {
                                        sh '''
                                            . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            npx playwright test --project=chrome
                                        '''
                                    } finally {
                                        junit(
                                            allowEmptyResults: true,
                                            testResults: '**/test-results/chrome/junit-*.xml'
                                        )
                                    }
                                }
                            }
                        }
                        
                        stage('Firefox Tests') {
                            steps {
                                script {
                                    try {
                                        sh '''
                                            . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            npx playwright test --project=firefox
                                        '''
                                    } finally {
                                        junit(
                                            allowEmptyResults: true,
                                            testResults: '**/test-results/firefox/junit-*.xml'
                                        )
                                    }
                                }
                            }
                        }
                        
                        stage('Safari Tests') {
                            steps {
                                script {
                                    try {
                                        sh '''
                                            . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            npx playwright test --project=webkit
                                        '''
                                    } finally {
                                        junit(
                                            allowEmptyResults: true,
                                            testResults: '**/test-results/webkit/junit-*.xml'
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
                
                stage('Mobile Browser Tests') {
                    parallel {
                        stage('Mobile Chrome Tests') {
                            steps {
                                script {
                                    try {
                                        sh '''
                                            . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            npx playwright test --project=mobile-chrome
                                        '''
                                    } finally {
                                        junit(
                                            allowEmptyResults: true,
                                            testResults: '**/test-results/mobile-chrome/junit-*.xml'
                                        )
                                    }
                                }
                            }
                        }
                        
                        stage('Mobile Safari Tests') {
                            steps {
                                script {
                                    try {
                                        sh '''
                                            . "$NVM_DIR/nvm.sh"
                                            nvm use ${NODE_VERSION}
                                            npx playwright test --project=mobile-safari
                                        '''
                                    } finally {
                                        junit(
                                            allowEmptyResults: true,
                                            testResults: '**/test-results/mobile-safari/junit-*.xml'
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
            
            post {
                always {
                    archiveArtifacts(
                        artifacts: '''
                            playwright-report/**/*,
                            test-results/**/*,
                            test-results/trace.zip
                        ''',
                        allowEmptyArchive: true
                    )
                }
                success {
                    script {
                        if (currentBuild.previousBuild?.result == 'FAILURE') {
                            emailext(
                                subject: "✅ Tests Fixed: ${currentBuild.fullDisplayName}",
                                body: "All tests have passed after previous failure.\nBuild URL: ${BUILD_URL}",
                                recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                                to: env.EMAIL_RECIPIENTS
                            )
                        }
                    }
                }
                failure {
                    script {
                        emailext(
                            subject: "❌ Test Failure: ${currentBuild.fullDisplayName}",
                            body: """Test execution failed!
                                |Failed Stage: ${STAGE_NAME}
                                |Build URL: ${BUILD_URL}
                                |Console Output: ${BUILD_URL}console
                                |Test Report: ${BUILD_URL}testReport/""".stripMargin(),
                            recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                            to: env.EMAIL_RECIPIENTS
                        )
                    }
                }
                unstable {
                    script {
                        emailext(
                            subject: "⚠️ Unstable Tests: ${currentBuild.fullDisplayName}",
                            body: """Test execution is unstable!
                                |Build URL: ${BUILD_URL}
                                |Test Report: ${BUILD_URL}testReport/""".stripMargin(),
                            recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                            to: env.EMAIL_RECIPIENTS
                        )
                    }
                }
            }
        }

        stage('Generate Test Reports') {
            steps {
                script {
                    // Generate test trend reports
                    plot csvFileName: 'test-trend.csv',
                         csvSeries: [[file: 'test-results/**/junit-*.xml', exclusionValues: '', inclusionFlag: 'INCLUDE_BY_STRING', url: '']],
                         group: 'Test Results',
                         style: 'line',
                         title: 'Test Duration Trend',
                         yaxis: 'Duration (ms)'
                    
                    // Generate test coverage badge
                    publishHTML(
                        target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: true,
                            keepAll: true,
                            reportDir: 'playwright-report',
                            reportFiles: 'index.html',
                            reportName: 'Playwright Report'
                        ]
                    )
                }
            }
        }
    }

    post {
        always {
            // Send Slack notification
            script {
                def color = currentBuild.currentResult == 'SUCCESS' ? 'good' : 'danger'
                def message = """
                    *${currentBuild.fullDisplayName}*
                    Status: ${currentBuild.currentResult}
                    Duration: ${currentBuild.durationString}
                    Build URL: ${BUILD_URL}
                    Test Report: ${BUILD_URL}testReport/
                """.stripIndent()

                // Use credential binding for Slack
                withCredentials([string(credentialsId: 'slack-token', variable: 'SLACK_TOKEN')]) {
                    slackSend(
                        channel: env.SLACK_CHANNEL,
                        color: color,
                        message: message,
                        tokenCredentialId: 'slack-token'
                    )
                }

                // Use credential binding for email
                emailext (
                    to: env.EMAIL_RECIPIENTS,
                    subject: "${currentBuild.currentResult}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
                    body: """<p>Test Status: ${currentBuild.currentResult}</p>
                        <p>Job: ${env.JOB_NAME} [${env.BUILD_NUMBER}]</p>
                        <p>View detailed results: 
                        <a href='${env.BUILD_URL}'>${env.BUILD_URL}</a></p>""",
                    recipientProviders: [[$class: 'DevelopersRecipientProvider']],
                    mimeType: 'text/html'
                )
            }
            cleanWs()
        }
    }
}