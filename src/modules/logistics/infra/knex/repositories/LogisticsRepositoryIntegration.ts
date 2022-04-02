import { IUpdateContract, IGetLogistics, IGetSender, IGetLot } from '@modules/logistics/dtos/ILogistics';
import { ILogisticsRepositoryIntegration } from '@modules/logistics/repositories/ILogisticsRepositoryIntegration';
import { connection } from '@shared/infra/knex';
import { responseLogistics } from './ResponseLogistics';

class LogisticsRepositoryIntegration implements ILogisticsRepositoryIntegration {
  /**Metodo para atualizar contract com o idSender */
  public async updateContract({ idLot, idSender }: IUpdateContract): Promise<boolean> {
    const updateContract: IUpdateContract = await connection('payments_logistics').where({ lot: idLot }).update({ contract: idSender });
    return updateContract != 1;
  }
  /**Metodo para pegar Logistics */
  public async getLogistics({ idContract, idSender }: IUpdateContract): Promise<IGetLogistics> {
    const getLogistics: IGetLogistics = await connection('configurations_logistics')
      .select({
        id: 'configurations_logistics.id',
        correiosUser: 'configurations_logistics.correios_user',
        correiosPass: 'configurations_logistics.correios_pass',
        correiosPostcard: 'configurations_logistics.correios_postcard',
        correiosContractNumber: 'configurations_logistics.correios_contract_number',
        correiosAdmCode: 'correios_adm_code',
        correiosServicePac: 'configurations_logistics.correios_service_pac',
        correiosServiceSedex: 'configurations_logistics.correios_service_sedex',
        correiosServiceCarta: 'configurations_logistics.correios_service_carta',
        correiosServiceMinienvios: 'configurations_logistics.correios_service_minienvios',
        type: 'configurations_logistics.type',
        melhorenvioEmail: 'configurations_logistics.melhorenvio_email',
        melhorenvioToken: 'configurations_logistics.melhorenvio_token',
        jadlogToken: 'configurations_logistics.jadlog_token',
      })
      .from('configurations_logistics')
      .innerJoin('configurations_logistics_sender', 'configurations_logistics.id', 'configurations_logistics_sender.logistic_id')
      .where({ 'configurations_logistics.id': idContract })
      .andWhere({ 'configurations_logistics_sender.id': idSender })
      .first();

    const getLogisticsResponse: IGetLogistics = {
      id: getLogistics.id,
      correiosUser: getLogistics.correiosUser,
      correiosPass: getLogistics.correiosPass,
      correiosPostcard: getLogistics.correiosPostcard,
      correiosContractNumber: getLogistics.correiosContractNumber,
      correiosAdmCode: getLogistics.correiosAdmCode,
      correiosServicePac: getLogistics.correiosServicePac,
      correiosServiceSedex: getLogistics.correiosServiceSedex,
      correiosServiceCarta: getLogistics.correiosServiceCarta,
      correiosServiceMinienvios: getLogistics.correiosServiceMinienvios,
      type: getLogistics.type,
      melhorenvioEmail: getLogistics.melhorenvioEmail,
      melhorenvioToken: getLogistics.melhorenvioToken,
      jadlogToken: getLogistics.jadlogToken
    };
    responseLogistics.setLogistics(getLogisticsResponse);
    return getLogisticsResponse;
  }
  /**Metodo para pegar o sender */
  public async getSender({ idContract, idSender }: IUpdateContract): Promise<IGetSender> {
    const getSender: IGetSender = await connection('configurations_logistics')
      .select({
        id: 'configurations_logistics_sender.Id',
        name: 'configurations_logistics_sender.name',
        telephone: 'configurations_logistics_sender.telephone',
        email: 'configurations_logistics_sender.email',
        cnpj: 'configurations_logistics.cnpj',
        street: 'configurations_logistics_sender.street',
        complement: 'configurations_logistics_sender.complement',
        number: 'configurations_logistics_sender.number',
        neighborhood: 'configurations_logistics_sender.neighborhood',
        city: 'configurations_logistics_sender.city',
        state: 'configurations_logistics_sender.state',
        postalcode: 'configurations_logistics_sender.postalcode',
        directors: 'configurations_logistics_sender.directors',
      })
      .from('configurations_logistics')
      .innerJoin('configurations_logistics_sender', 'configurations_logistics.id', 'configurations_logistics_sender.logistic_id')
      .where({ 'configurations_logistics.id': idContract })
      .andWhere({ 'configurations_logistics_sender.id': idSender })
      .first();

    const getSenderResponse: IGetSender = {
      id: getSender.id,
      name: getSender.name,
      telephone: getSender.telephone,
      email: getSender.email,
      cnpj: getSender.cnpj,
      street: getSender.street,
      complement: getSender.complement,
      number: getSender.number,
      neighborhood: getSender.neighborhood,
      city: getSender.city,
      state: getSender.state,
      postalcode: getSender.postalcode,
      directors: getSender.directors,
    };

    responseLogistics.setSender(getSenderResponse);
    return getSenderResponse;
  }

  /**Metodo para pegar lot */
  public async getLot({ idLot }: IUpdateContract): Promise<IGetLot> {
    const getLot: any = await connection('payments_logistics')
      .select({
        paymentId: 'payments_logistics.pid',
        type: 'payments_logistics.type',
        upsellOid: 'payments.upsell_oid',
        clientName: 'clients_address.name',
        clientPhoneNumber: 'clients_address.phone_number',
        clientEmail: 'clients.email',
        clientDocument: 'clients.document',
        clientStreet: 'clients_address.street',
        clientComplement: 'clients_address.complement',
        clientNumber: 'clients_address.number',
        clientNeighborhood: 'clients_address.neighborhood',
        clientCity: 'clients_address.city',
        clientState: 'clients_address.state',
        clientPostalCode: 'clients_address.postal_code',

        title: 'products_plans.title',
        units: 'products_plans.units',
        weight: 'products_plans.weight',
        dimensions: 'products_plans.dimensions',
        amount: 'products_plans.amount',
        format: 'products_plans.format',
        nfChave: 'payments_nfe.nf_chave',
        nfNumber: 'payments_nfe.nf_number',
        nfSerie: 'payments_nfe.nf_series',
        nfAmount: 'payments_nfe.amount',
      })
      .from('payments_logistics')
      .leftJoin('payments', 'payments.id', 'payments_logistics.pid')
      .leftJoin('clients', 'payments.cid', 'clients.id')
      .leftJoin('clients_address', 'payments.cid_address', 'clients_address.id')
      .leftJoin('products_plans', 'payments.plan_id', 'products_plans.id')
      .leftJoin('payments_nfe', 'payments_nfe.pid', 'payments_logistics.pid')
      .where({
        'payments_logistics.lot': idLot,
      });

    const getLotResponse: IGetLot = getLot.map((logisticsLot) => {
      return {
        paymentId: logisticsLot.paymentId,
        type: logisticsLot.type,
        upsellOid: logisticsLot.upsellOid,
        name: logisticsLot.clientName,
        phoneNumber: logisticsLot.clientPhoneNumber,
        email: logisticsLot.clientEmail,
        document: logisticsLot.clientDocument,
        street: logisticsLot.clientStreet,
        complement: logisticsLot.clientComplement,
        number: logisticsLot.clientNumber,
        neighborhood: logisticsLot.clientNeighborhood,
        city: logisticsLot.clientCity,
        state: logisticsLot.clientState,
        postalCode: logisticsLot.clientPostalCode,
        title: logisticsLot.title,
        units: logisticsLot.units,
        amount: logisticsLot.amount,
        dimensions: logisticsLot.dimensions,
        weight: logisticsLot.weight,
        format: logisticsLot.format,
        nfeKey: {
          chave: logisticsLot.nfChave,
          number: logisticsLot.nfNumber,
          serie: logisticsLot.nfSerie,
          amount: logisticsLot.nfAmount,
        },
      };
    });
    responseLogistics.setLot(getLotResponse);
    return getLotResponse;
  }
}
export { LogisticsRepositoryIntegration };
