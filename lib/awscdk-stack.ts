import * as cdk from 'aws-cdk-lib'; // in V1 it was import * as cdk from '@aws-cdk/core';
import { Construct } from 'constructs';
import {Bucket, BucketEncryption} from 'aws-cdk-lib/aws-s3';
import { Networking } from './networking';
import * as path from 'path';
import { DocumentManagementAPI } from './api';
import { DocumentManagementWebserver } from './webserver';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AwscdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    //this = reference to the stack the construct is defined in
    //id = will be the basis for the logical ID of the construct in CloudFormation
    const bucket = new Bucket(this, "DocumentsBucket", {
      encryption: BucketEncryption.S3_MANAGED,
    });

    new cdk.aws_s3_deployment.BucketDeployment(this, 'DocumentsDeployment', {
      sources: [
        cdk.aws_s3_deployment.Source.asset(path.join(__dirname,  '..', 'documents'))
      ],
      destinationBucket: bucket,
      memoryLimit: 512
    })

    // pass in the stack for this construct, the logical ID of the construct, and the value to export
    new cdk.CfnOutput(this, "DocumentsBucketNameExport", {
      value: bucket.bucketName,
      exportName: "DocumentsBucketName",
    });

  const networking =  new Networking(this, 'NetworkingConstruct', {
      maxAzs: 2
    })

    // apply the tags to the network construct scope (the stack)
    cdk.Tags.of(networking).add('Module', 'Networking');

    // create the API construct and pass in the bucket name
    const api = new DocumentManagementAPI(this, 'DocumentManagementAPI',{documentBucket: bucket, 
      region: this.region,
      account: this.account});
    cdk.Tags.of(api).add('Module', 'API');

    const webserver = new DocumentManagementWebserver(this, 'DocumentManagementWebserver', {
      vpc: networking.vpc,
      api: api.httpApi
    })

    cdk.Tags.of(webserver).add('Module', 'Webserver');
   }
}
