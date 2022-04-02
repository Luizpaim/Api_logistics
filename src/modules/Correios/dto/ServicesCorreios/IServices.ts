export type ServiceCodeResponse = {
  [key: string]: string;
};
export interface IServices {
  internalId: string;
  serviceId: string;
}

export interface ICorreiosServicesInput {
  user?: string;
  password?: string;
  postalCard?: string;
  contractId: string;
}

export interface ICorreiosServicesResponse {
  id: string;
  codeInternal: string;
  dateUpdate: string;
  name: string;
  details: {
    category: string;
    chancela: {
      description: string;
      id: string;
    };
    description: string;
  };
}
export interface ICorreiosServicesRequest {
  correiosUser?: string;
  correiosPass?: string;
}
export interface ISaveServices {
    serviceId: string,
    codeInternal: string,
    name: string,
    details: string,
    dateUpdate: Date
}
