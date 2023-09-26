# Webserver Container
- Need to create a new tsconfig.json file in the root of the webserver root to allow it to be transferred into the container
- tsconfig assumes that the source code is in the src folder and the compiled code is in the dist folder, this needs to fact into the docker file 

- ejs is the view engine for express

## Dockerfile
# bind port 8080 to the container port 8080 and then use the port 8080 in the container
# api_base is the http endpoint for the api gateway
"docker:run": "docker run -p 8080:8080 -e SERVER_PORT=8080 -e API_BASE=https://v0bmb6qvdk.execute-api.us-east-1.amazonaws.com/ -d fullmetal/poc-webserver"

npm run docker:build # builds the docker image
npm run docker:run # runs the docker image
http://localhost:8080 # should show the index.html page and the api gateway should be called to list the documents

## Installs
// from containers/webserver folder - must use specific version of axios to avoid bug in latest for typescript compilation
npm install axios@0.19.0 ejs express --save 
npm install typescript @types/express @types/node --save-dev

## Issues 
https://stackoverflow.com/questions/61265108/aws-ecs-fargate-resourceinitializationerror-unable-to-pull-secrets-or-registry