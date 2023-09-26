# Welcome to your CDK TypeScript project
* This is a CDK project to create a simple API Gateway and Lambda function using a mono repo approach
* The Lambda function is a simple function that returns a list of documents
* The API Gateway is a simple API Gateway that calls the Lambda function
* The Lambda function is written in Typescript
* The API Gateway is written in Typescript
* The CDK project is written in Typescript
* The CDK project is deployed to AWS using the CDK CLI
* A containerised webserver is used to test the API Gateway
* A VPC is created with a public and private subnet to host the containerised webserver

[Based on Infrastructure with Typescript getting started]
https://app.pluralsight.com/course-player?clipId=4b549193-42ba-43d8-a237-186f66f8b100

# Following changes made
* Ported to CDK v2
* Replaced Parcel with ESBuild
* Use Fargate V1.3.0
* Use L1 Constructs for API Gateway

## Useful commands
* `aws configure list --profile fullmetalbracket`  list the profile
* `cdk --version`  prints the CDK version
* `npm install -g aws-cdk`  install the CDK
* `cdk list`        list all stacks in the app
* `cdk init app --language typescript`  create a new project
* `cdk docs`        open CDK documentation
* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test` `npm test`    perform the jest unit tests
* `npm view @types/aws-lambda version`   check versions of packages

* `cdk bootstrap`   bootstrap the AWS environment (only once) - creates the CDKToolkit stack in your default AWS account and region 
* `cdk bootstrap --profile fullmetalbracket`   bootstrap the AWS environment (only once) - creates the CDKToolkit stack in your default AWS account and region
* `cdk bootstrap aws://082593406990/eu-west-2 --profile fullmetalbracket`
* `cdk bootstrap --profile fullmetalbracket --cloudformation-execution-policies arn:aws:iam::aws:policy/AdministratorAccess`   

* `cdk deploy --profile fullmetalbracket --all --require-approval never`      deploy all stacks to your default AWS account/region
* `cdk deploy --profile fullmetalbracket --all`      deploy all stacks to your default AWS account/region
* `cdk deploy --profile fullmetalbracket`      deploy this stack to your default AWS account/region
* `cdk deploy`      deploy this stack to your default AWS account/region

* `cdk diff`        compare deployed stack with current state
* `cdk synth --output=./templates`       emits the synthesized CloudFormation template
* `cdk destroy`     destroy the stack
* `aws cloudformation list-exports`       list all exports

## Installs
xxxx --old v1 mechanism npm install @aws-cdk/aws-s3 --save # npm install @aws-cdk/aws-s3@1.62.0 --save
xxxx --old v1 mechanism npm install @aws-cdk/aws-ec2 --save # EC2 instance type and size (t2.micro)

npm install aws-cdk-lib@latest constructs // from root folder
npm install // from api/getdocuments folder to install API Service dependencies

## Note
The `cdk.json` file tells the CDK Toolkit how to execute your app.

The structure of aws-cdk-lib is different from the older style of individual @aws-cdk/ modules.
In aws-cdk-lib, all AWS service modules are accessible as named exports.