import { IGetPaymentsLogistics } from '@modules/Correios/dto/BlockObject/IBlockObject';
import { IServices, ServiceCodeResponse } from '@modules/Correios/dto/ServicesCorreios/IServices';
import { ICorreiosServicesRequest, ISaveServices } from '@modules/Correios/dto/ServicesCorreios/IServices';
import { ISaveTag } from '@modules/Correios/dto/Tag/ITag';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';
import { IUpdateContract, IGetLogistics, IGetSender, IGetLot } from '@modules/logistics/dtos/ILogistics';
import { connection } from '@shared/infra/knex';
import { responseCorreios } from './ResponseCorreios';

class CorreiosRepository implements ICorreiosRepository {
  /**Metodo para pegar serviços cprreios */
  public async getServices(): Promise<ServiceCodeResponse> {
    const services: any = await connection('configurations_logistics_services').select({ internalId: 'internal_id', serviceId: 'service_id' });

    for await (const service of services) {
      responseCorreios.ServicesCodes[service.internalId] = service.serviceId;
    }
    return;
  }

  /**Metodo para Salvar TAGS retornadas pelo correios na base */
  public async saveTag({ plpId, tag, contract, dimensions, weight, date_updated, type, service, pid, upSellOid }: ISaveTag): Promise<boolean> {
    const saveTag: any = await connection.transaction(async (sale) => {
      await connection('payments_logistics')
        .update({
          integration_id: plpId,
          tracking_code: tag,
          contract: contract,
          dimensions: dimensions,
          weight: weight,
          date_updated: date_updated,
          type: type,
          service: service,
        })
        .where({ pid: pid });

      if (upSellOid && upSellOid !== 0) {
        await connection('payments_logistics')
          .update({
            integration_id: plpId,
            tracking_code: tag,
            contract: contract,
            dimensions: dimensions,
            weight: weight,
            date_updated: date_updated,
            type: type,
            service: service,
          })
          .where({ pid: pid });
      }
      await connection('payments_logs').insert({
        json: JSON.stringify({
          type: 'generateTags',
          isSender: contract,
          plp: plpId,
          tag: tag,
          alto: false,
        }),
        date_updated: new Date(),
        date_created: new Date(),
        type: '3',
      });
      await sale.commit();
    });
    return saveTag != 1;
  }

  /**metodo para pegar logisticas do correios */
  public async getLogisticsCorreios({ idContract }: IUpdateContract): Promise<IGetLogistics> {
    const getLogistics: IGetLogistics = await connection('configurations_logistics')
      .select({
        id: 'id',
        correiosUser: 'correios_user',
        correiosPass: 'correios_pass',
        correiosAdmCode: 'correios_adm_code',
      })
      .where({ 'configurations_logistics.id': idContract })
      .first();

    const logisticsResponse: IGetLogistics = {
      id: getLogistics.id,
      correiosUser: getLogistics.correiosUser,
      correiosPass: getLogistics.correiosPass,
      correiosAdmCode: getLogistics.correiosAdmCode,
    };
    responseCorreios.setLogistics(logisticsResponse);
    return logisticsResponse;
  }

  /**metodo para pegar cep remetente  */
  public async getCepSender({ idSender, idContract }: IUpdateContract): Promise<IGetSender> {
    const getCep: IGetSender = await connection('configurations_logistics_sender')
      .select({ postalcode: 'postalcode' })
      .where({ 'configurations_logistics_sender.id': idSender })
      .andWhere({
        'configurations_logistics_sender.logistic_id': idContract,
      })
      .first();

    const getCepResponse: IGetSender = {
      postalcode: getCep.postalcode,
    };
    responseCorreios.setCep(getCepResponse);
    return getCepResponse;
  }
  /**metodo para pegar lot */
  public async getLot({ idLot }: IUpdateContract): Promise<IGetLot> {
    const getLot: any = await connection('payments_logistics')
      .select({
        id: 'products_plans.id',
        weight: 'products_plans.weight',
        dimensions: 'products_plans.dimensions',
        amount: 'products_plans.amount',
        format: 'products_plans.format',
        cepDestination: 'clients_address.postal_code',
      })
      .from('payments_logistics')
      .leftJoin('payments', 'payments.id', 'payments_logistics.pid')
      .leftJoin('clients_address', 'payments.cid_address', 'clients_address.id')
      .leftJoin('products_plans', 'payments.plan_id', 'products_plans.id')
      .where({ 'payments_logistics.lot': idLot });

    const getLotResponse: IGetLot = getLot.map((logistics) => {
      return {
        id: logistics.id,
        weight: logistics.weight,
        dimensions: logistics.dimensions,
        amount: logistics.amount,
        format: logistics.format,
        cepDestination: logistics.cepDestination,
      };
    });

    responseCorreios.setProducts(getLotResponse);
    return getLotResponse;
  }

  /**metodo para pegar correios_pass */
  public async getCorreiosPass({ correiosUser }: ICorreiosServicesRequest): Promise<ICorreiosServicesRequest> {
    const getCorreiosPass: any = await connection('configurations_logistics')
      .select({ correiosPass: 'configurations_logistics.correios_pass' })
      .from('configurations_logistics')
      .where({ 'configurations_logistics.correios_user': correiosUser })
      .first();

    const getCorreiosPassResponse: any = {
      correiosPass: getCorreiosPass.correiosPass,
    };
    responseCorreios.setCorreiosPass(getCorreiosPassResponse);
    return getCorreiosPassResponse;
  }

  /**metodo para salvar services */
  public async saveServices({ serviceId, codeInternal, name, details, dateUpdate }: ISaveServices): Promise<ISaveServices> {
    const saveServices: ISaveServices = await connection('configurations_logistics_services').insert({
      internal_id: serviceId,
      service_id: codeInternal,
      description: name,
      service: details,
      date_due: dateUpdate,
    });
    return saveServices;
  }

  /**metodo para pegar payments logistics */
  public async getPaymentsLogistics(idTracking: string): Promise<IGetPaymentsLogistics> {
    const getPaymentsLogistics: any = await connection('payments_logistics')
      .select({
        type: 'type',
        integrationId: 'integration_id',
        contract: 'contract',
        trackingCode: 'tracking_code',
      })
      .from('payments_logistics')
      .where({ 'payments_logistics.id': idTracking })
      .first();

    const paymentsLogisticsResponse: any = {
      type: getPaymentsLogistics.type,
      integrationId: getPaymentsLogistics.integrationId,
      contract: getPaymentsLogistics.contract,
      trackingCode: getPaymentsLogistics.trackingCode,
    };
    responseCorreios.setPaymentsLogistics(paymentsLogisticsResponse);
    return paymentsLogisticsResponse;
  }

  public async getLogisticsContract({ contract }: any): Promise<IGetLogistics> {
    const getLogisticsContract: IGetLogistics = await connection('configurations_logistics_sender')
      .select({
        correiosUser: 'configurations_logistics.correios_user',
        correiosPass: 'configurations_logistics.correios_pass',
        correiosPostcard: 'configurations_logistics.correios_postcard',
      })
      .from('configurations_logistics_sender')
      .leftJoin('configurations_logistics', 'configurations_logistics.id', 'configurations_logistics_sender.logistic_id')
      .where({ 'configurations_logistics_sender.id': contract })
      .first();

    const getLogisticsContractResponse: IGetLogistics = {
      correiosUser: getLogisticsContract.correiosUser,
      correiosPass: getLogisticsContract.correiosPass,
      correiosPostcard: getLogisticsContract.correiosPostcard,
    };
    responseCorreios.setLogisticsContract(getLogisticsContractResponse);
    return getLogisticsContractResponse;
  }
}
export { CorreiosRepository };
