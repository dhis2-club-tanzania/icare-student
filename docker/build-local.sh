branch=$(git branch | grep \* | cut -d ' ' -f2)


docker run -w="/app" -v "$(pwd)/ui":/app udsmdhis2/icare-ui-compiler cp -r /node_modules .
docker run -w="/app" -v "$(pwd)/ui":/app udsmdhis2/icare-ui-compiler npm install
docker run -w="/app" -v "$(pwd)/ui":/app udsmdhis2/icare-ui-compiler npm run build:prod
#cd ../docs
#docker run -w="/app" -v "$(pwd)":/app node:16.14 npm install
#docker run -w="/app" -v "$(pwd)":/app node:16.14 npm run build
#cd ..
#docker run --rm -v maven-repo:/root/.m2 -v $(pwd)/omods/core:/usr/src/omod -w /usr/src/omod maven:3.6.3-openjdk-11-slim mvn clean package -DskipTests
docker run --rm -v $(pwd)/omods/core:/usr/src/omod -w /usr/src/omod udsmdhis2/icare-omod-compiler mvn clean package -DskipTests
version=$(cat version)
docker build -t udsmdhis2/icare-core:student .