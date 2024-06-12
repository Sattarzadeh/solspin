import { Vpc, SubnetType, CfnEIP, CfnNatGateway, SecurityGroup } from "aws-cdk-lib/aws-ec2";
import * as cdk from "aws-cdk-lib";
import { StackContext } from "sst/constructs";

/**
 * Creates a VPC (Virtual Private Cloud) with public and private subnets, a NAT Gateway, and a security group.
 */
export function VPC ({ stack }: StackContext) {
  /**
   * VPC (Virtual Private Cloud): A virtual network dedicated to our AWS account.
   * It is logically isolated from other virtual networks in the AWS Cloud.
   */
  const vpc = new Vpc(stack, 'VPC', {
    cidr: '10.0.0.0/16', // The CIDR block for the VPC, defining the range of IP addresses.
    maxAzs: 2, // The maximum number of Availability Zones to use for the VPC.
    subnetConfiguration: [
      {
        cidrMask: 24, // The number of bits for the subnet mask.
        name: 'public_subnet_1',
        subnetType: SubnetType.PUBLIC, // A public subnet that is accessible from the internet.
      },
      {
        cidrMask: 24,
        name: 'private_subnet_1',
        subnetType: SubnetType.PRIVATE_WITH_EGRESS, // A private subnet with outbound internet access via NAT Gateway.
      },
      {
        cidrMask: 24,
        name: 'private_subnet_2',
        subnetType: SubnetType.PRIVATE_ISOLATED, // A private subnet with no internet access.
      },
    ],
  });

  /**
   * EIP (Elastic IP): A static public IP address that is allocated to our AWS account.
   * It can be associated with an EC2 instance or a NAT Gateway.
   */
  const eip = new CfnEIP(stack, 'NatGatewayEIP', {
    domain: 'vpc', // The domain for the EIP (in this case, it's associated with the VPC).
  });

  /**
   * NAT Gateway: A managed service that allows instances in a private subnet to connect to the internet
   * or other AWS services, while preventing the internet from initiating a connection with those instances.
   */
  new CfnNatGateway(stack, 'NatGateway', {
    subnetId: vpc.publicSubnets[0].subnetId, // The ID of the public subnet where the NAT Gateway will be placed.
    allocationId: eip.attrAllocationId, // The allocation ID of the Elastic IP to associate with the NAT Gateway.
  });

  /**
   * Security Group: A virtual firewall that controls inbound and outbound traffic for instances.
   * It acts at the instance level, not the subnet level.
   */
  const securityGroup = new SecurityGroup(stack, 'VPCSecurityGroup', {
    vpc, // The VPC in which to create the security group.
    allowAllOutbound: true, // Whether to allow all outbound traffic by default.
  });

  // Expose the VPC ID and security group ID as CloudFormation outputs.
  new cdk.CfnOutput(stack, "VpcId", {
    value: vpc.vpcId,
    exportName: "SolSpinVpcId",
  });
  new cdk.CfnOutput(stack, "SecurityGroupId", {
    value: securityGroup.securityGroupId,
    exportName: "SolSpinVpcSecurityGroupId",
  });

  // Return the VPC and security group ID for use in other parts of the stack.
  return {
    vpc,
    securityGroupId: securityGroup?.securityGroupId,
  };
}