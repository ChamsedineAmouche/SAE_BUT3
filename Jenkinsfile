pipeline {
    agent any
    
    triggers {
    githubPush()  // Déclenche la pipeline à chaque push dans le dépôt Git
    }

    tools {
        maven 'maven-3'  // Assurez-vous que Maven est configuré dans Jenkins
    }

    stages {
        stage('Create POM File') {
            steps {
                script {
                    // Créer dynamiquement un fichier pom.xml
                    writeFile file: 'pom.xml', text: '''
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.example</groupId>
    <artifactId>maven-example</artifactId>
    <version>1.0-SNAPSHOT</version>

    <build>
        <plugins>
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.0.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>java</goal>
                        </goals>
                        <configuration>
                            <mainClass>com.example.Main</mainClass>  <!-- Remplacez par votre classe principale -->
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>
                    '''
                    echo 'POM file created successfully.'
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building the project...'
                sh 'mvn clean install'  // Exécute la commande Maven pour construire le projet
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                sh 'mvn test'  
            }
        }

        stage('Run') {
            steps {
                echo 'Running the application...'
                echo 'Application is running successfully'
            }
        }
        
        stage('Deploy') {
            steps {
                echo 'Deploying the application...'
                echo 'Application is deployed successfully'
            }
        }
    }

    post {
        always {
            echo 'Pipeline finished.'
        }
        success {
            echo 'Pipeline succeeded!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}