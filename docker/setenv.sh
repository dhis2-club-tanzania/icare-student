#export JAVA_OPTS="-Dfile.encoding=UTF-8 -server -Xms256m -Xmx768m -XX:PermSize=256m -XX:MaxPermSize=512m -javaagent:/glowroot/glowroot.jar"
export JAVA_OPTS="-Dfile.encoding=UTF-8 -server -Xms$INNITIAL_HEAP_SIZE -Xmx$MAX_HEAP_SIZE -XX:PermSize=$PERMANENT_SIZE -XX:MaxPermSize=$MAX_PERMANENT_SIZE -javaagent:/glowroot/glowroot.jar"
export CATALINA_OPTS="-DOPENMRS_INSTALLATION_SCRIPT=/usr/local/tomcat/openmrs-server.properties -DOPENMRS_APPLICATION_DATA_DIRECTORY=/usr/local/tomcat/.OpenMRS"
