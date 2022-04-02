export type IBlockObjectInput = {
  idPlp: string; 
  idTracking: string;
};

export type IBlockObjectResponse = {
  status: boolean;
};

export interface IGetPaymentsLogistics {
  id: string;
  type: string;
  integrationId: string;
  contract: string;
  trackingCode: string;
}
