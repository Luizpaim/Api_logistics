export interface IValidateContractInput {
  user: string;
  password?: string;
  postalCard: string;
}

export interface IValidateContractResponse {
  status: boolean;
  message?: string;
}
