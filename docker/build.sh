sh docker/build-local.sh
version=$(cat version)
branch=$(git branch | grep \* | cut -d ' ' -f2)
docker push udsmdhis2/icare-core:$branch