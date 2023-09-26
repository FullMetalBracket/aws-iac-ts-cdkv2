import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

// custom construct to create a VPC with public and private subnets
// and return the VPC object
// need to pass in the max number of availability zones to use
// need to declare variables for the VPC and subnets that can be passed to other constructs

interface NetworkingProps {
  // max number of availability zones to use
  maxAzs:number
}

export class Networking extends Construct {
  public readonly vpc: cdk.aws_ec2.IVpc
  constructor(scope: Construct, id: string, props: NetworkingProps) {
    super(scope, id);
    this.vpc = new cdk.aws_ec2.Vpc(this, 'AppVPC', {
      cidr: '10.0.0.0/16',
      maxAzs: props.maxAzs,
      subnetConfiguration: [
        {
          subnetType: cdk.aws_ec2.SubnetType.PUBLIC,
          name: 'Public',
          cidrMask: 24,
        },
        {
          cidrMask: 24,
          name: 'Private',
          subnetType: cdk.aws_ec2.SubnetType.PRIVATE_ISOLATED,
        }
      ],
    });    
  }
}
