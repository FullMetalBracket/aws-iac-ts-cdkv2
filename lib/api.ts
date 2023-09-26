import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as path from 'path';

interface DocumentManagementAPIProps {
  documentBucket:cdk.aws_s3.Bucket,
  region:string,
  account:string
}

export class DocumentManagementAPI extends Construct {

  public readonly httpApi: cdk.aws_apigatewayv2.CfnApi;

  constructor(scope: Construct, id: string, props: DocumentManagementAPIProps) {
    super(scope, id);

    // create the getDocuments function
    const getDocumentsFunction = new cdk.aws_lambda_nodejs.NodejsFunction(this, 'GetDocumentsFunction', {
      runtime: cdk.aws_lambda.Runtime.NODEJS_18_X,
      // need to set the entry to the index.ts file in the getDocuments folder for the api function entry point
      // join the path to the index.ts file in the getDocuments folder relative to the current directory but in a platform agnostic way
      entry: path.join(__dirname, '..', 'api', 'getDocuments', 'index.ts'),
      // need to set the handler to the name of the function exported from the index.ts file in the getDocuments folder
      handler: 'getDocuments',
      bundling: {
        // don't bundle the external modules listed here
        externalModules: [
          //'aws-sdk'
        ]
      },
      environment: {
        DOCUMENTS_BUCKET_NAME: props.documentBucket.bucketName || ''
      }
    })

    // add permissions to the getDocuments function to access the bucket (contents of the bucket) 
    const bucketPermissions = new cdk.aws_iam.PolicyStatement();
    bucketPermissions.addResources(`${props.documentBucket.bucketArn}/*`);
    bucketPermissions.addActions('s3:GetObject', 's3:PutObject')
    getDocumentsFunction.addToRolePolicy(bucketPermissions)

    // add permissions to the actual bucket to allow the getDocuments function to list the bucket
    const bucketContainerPermissions = new cdk.aws_iam.PolicyStatement();
    bucketContainerPermissions.addResources(props.documentBucket.bucketArn ?? '');
    bucketContainerPermissions.addActions('s3:ListBucket')
    getDocumentsFunction.addToRolePolicy(bucketContainerPermissions)
    
    this.httpApi = new cdk.aws_apigatewayv2.CfnApi(this, 'HttpAPI', {
      name : 'document-management-api',
      protocolType: 'HTTP',
      corsConfiguration: {
        allowMethods: ["GET" ],
        allowOrigins: ['*'],
        maxAge: cdk.Duration.days(10).toSeconds()
      }
    });
   
    // create a default stage
    const stage = new cdk.aws_apigatewayv2.CfnStage(this, 'DefaultStage', {
      apiId: this.httpApi.ref,
      autoDeploy: true,
      stageName: '$default',
      description: 'Default stage created by CDK'
    });

    const integration = new cdk.aws_apigatewayv2.CfnIntegration(this, 'LambdaIntegration', {
      apiId: this.httpApi.ref,
      integrationType: 'AWS_PROXY',
      integrationUri: `arn:aws:apigateway:${props.region}:lambda:path/2015-03-31/functions/${getDocumentsFunction.functionArn}/invocations`,
      payloadFormatVersion: '2.0'
    });
    
    getDocumentsFunction.addPermission('InvokePermission', {
      action: 'lambda:InvokeFunction',
      principal: new cdk.aws_iam.ServicePrincipal('apigateway.amazonaws.com'),
      sourceArn: `arn:aws:execute-api:${props.region}:${props.account}:${this.httpApi.ref}/*/*`
    });
    
    const getDocumentsRoute = new cdk.aws_apigatewayv2.CfnRoute(this, 'GetDocumentsRoute', {
      apiId: this.httpApi.ref,
      routeKey: 'GET /getDocuments',
      target: `integrations/${integration.ref}`,
    });

    new cdk.CfnOutput(this, 'APIEndpoint', {
      value: this.httpApi.attrApiEndpoint!,
      exportName: 'APIEndpoint'
    })
    
  }
}
