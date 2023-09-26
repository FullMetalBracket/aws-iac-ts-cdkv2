import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as escp from 'aws-cdk-lib/aws-ecs-patterns';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as apigv2 from 'aws-cdk-lib/aws-apigatewayv2';

interface DocumentManagementWebserverProps {
  vpc: ec2.IVpc
  api: apigv2.CfnApi
}

export class DocumentManagementWebserver extends Construct {
  constructor(scope: Construct, id: string, props: DocumentManagementWebserverProps) {
    super(scope, id);

    const webserverDocker = new DockerImageAsset(this, 'WebserverDockerAsset', {
      directory: path.join(__dirname, '..', 'containers', 'webserver') // pass in the path to the webserver folder
    });

    const apiId = props.api.ref;  // This will get the API ID from the L1 CfnApi construct.
    const region = cdk.Stack.of(this).region;  // Assuming 'this' is a construct or stack.
    const apiUrl = `https://${apiId}.execute-api.${region}.amazonaws.com/`;

    // use the esc pattern to create a load balanced fargate service
    const fargateService = new escp.ApplicationLoadBalancedFargateService(this, 'WebserverService', {
      vpc: props.vpc, // specify existing VPC rather than create a new one
      taskImageOptions: {
        image: ecs.ContainerImage.fromDockerImageAsset(webserverDocker),
        environment: {
          SERVER_PORT: "8080",
          API_BASE: apiUrl
        },
        containerPort: 8080,
      },
      platformVersion: ecs.FargatePlatformVersion.VERSION1_3
    });

    new cdk.CfnOutput(this, 'WebserverHost', {
      exportName: 'WebserverHost',
      value: fargateService.loadBalancer.loadBalancerDnsName
    });

  }
}
