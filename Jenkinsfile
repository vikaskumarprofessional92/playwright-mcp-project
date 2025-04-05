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
        DOCKER_BUILDKIT = '1'
        COMPOSE_PROJECT_NAME = "${JOB_NAME}-${BUILD_NUMBER}"
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

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker-compose build'
                }
            }
        }

        stage('Run Tests') {
            parallel {
                stage('API Tests') {
                    steps {
                        script {
                            try {
                                sh 'docker-compose run --rm api-tests'
                            } finally {
                                junit(
                                    allowEmptyResults: true,
                                    testResults: '**/test-results/api-tests/junit-*.xml'
                                )
                            }
                        }
                    }
                }
                
                stage('Browser Tests') {
                    steps {
                        script {
                            try {
                                sh 'docker-compose run --rm browser-tests'
                            } finally {
                                junit(
                                    allowEmptyResults: true,
                                    testResults: '**/test-results/**/junit-*.xml'
                                )
                            }
                        }
                    }
                }
                
                stage('Mobile Tests') {
                    steps {
                        script {
                            try {
                                sh 'docker-compose run --rm mobile-tests'
                            } finally {
                                junit(
                                    allowEmptyResults: true,
                                    testResults: '**/test-results/**/junit-*.xml'
                                )
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
                            test-results/**/*
                        ''',
                        allowEmptyArchive: true
                    )
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
            node('any') {  // Wrap post actions in a node block
                script {
                    // Clean up Docker resources
                    sh 'docker-compose down --remove-orphans --volumes'
                    
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
}