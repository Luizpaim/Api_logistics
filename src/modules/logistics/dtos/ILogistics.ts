export interface IUpdateContract {
  idLot?: string;
  idSender?: string;
  idContract?: string;
}

export interface IGetLogistics {
  id?: string;
  correiosUser?: string;
  correiosPass?: string;
  correiosPostcard?: string;
  correiosContractNumber?: string;
  correiosAdmCode?: string;
  correiosServicePac?: string;
  correiosServiceSedex?: string;
  correiosServiceCarta?: string;
  correiosServiceMinienvios?: string;
  type?: string;
  melhorenvioEmail?: string;
  melhorenvioToken?: string;
  jadlogToken?: string;
}

export interface IGetSender {
  id?: string;
  name?: string;
  telephone?: string;
  email?: string;
  cnpj?: string;
  street?: string;
  complement?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  postalcode?: string;
  directors?: string;
}

export interface IGetLot {
  paymentId: string;
  type: string;
  upsellOid: number;
  clientsAddress: {
    name: string;
    phoneNumber: string;
    email: string;
    document: string;
    street: string;
    complement: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
  };
  productsPlans?: {
    title: string;
    units: number;
    weight: number;
    dimensions: string;
    amount: number;
    format: string;

    nfeKey: {
      ncChave: string;
      nfNumber: string;
      nfSerie: string;
      nfAmount: string;
    };
  };
}
