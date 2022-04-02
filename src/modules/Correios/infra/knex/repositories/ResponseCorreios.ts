import { ServiceCodeResponse } from '@modules/Correios/dto/ServicesCorreios/IServices';

class ResponseCorreios {
  /**propiedade Serviços do correios */
  public ServicesCodes: ServiceCodeResponse = {};
  /**logisticas do correios */
  public id: string;
  public correiosUser: string;
  public correiosPass: string;
  public correiosAdmCode: string;
  public correiosPostcard: string;
  /**cep remetente */
  public postalcode: string;
  /**dimensões do produto */
  public lot: [
    {
      id: string;
      weight: string;
      dimensions: string;
      amount: number;
      format: string;
      cepDestination: string;
    }
  ];
  /** payments logistics */
  public idPay: string;
  public type: string;
  public integrationId: string;
  public contract: string;
  public trackingCode: string;

  public setLogistics(logistics): void {
    (this.id = logistics.id),
      (this.correiosUser = logistics.correiosUser),
      (this.correiosUser = logistics.correiosPass),
      (this.correiosAdmCode = logistics.correiosAdmCode);
    return;
  }
  public setCep(cep): void {
    return (this.postalcode = cep.postalcode);
  }
  public setProducts(products): void {
    this.lot = products;

    return;
  }
  public setCorreiosPass(correiosPass): void {
    return (this.correiosPass = correiosPass.correiosPass);
  }
  public setPaymentsLogistics(paymentsLogistics): void {
  
      (this.type = paymentsLogistics.type),
      (this.integrationId = paymentsLogistics.integrationId),
      (this.contract = paymentsLogistics.contract),
      (this.trackingCode = paymentsLogistics.trackingCode);
    return;
  }
  public setLogisticsContract(logistics): void {
    (this.correiosUser = logistics.correiosUser), (this.correiosPass = logistics.correiosPass), (this.correiosPostcard = logistics.correiosPostcard);
    return;
  }
}
export const responseCorreios = new ResponseCorreios();
