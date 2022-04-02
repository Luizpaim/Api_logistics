import { IGetLogistics, IGetLot, IGetSender, IUpdateContract } from '@modules/logistics/dtos/ILogistics';
import { IGetPaymentsLogistics } from '../dto/BlockObject/IBlockObject';
import { ICorreiosServicesRequest, ISaveServices, ServiceCodeResponse } from '../dto/ServicesCorreios/IServices';
import { ISaveTag } from '../dto/Tag/ITag';

interface ICorreiosRepository {
  /**metodo para pegar serviços correios */
  getServices(): Promise<ServiceCodeResponse>;

  /**metodo para salvar resposta dos correios  */
  saveTag({ plpId, tag, contract, dimensions, weight, date_updated, type, service, pid, upSellOid }: ISaveTag): Promise<boolean>;

  /**metodo para pegar logisticas dos correios */
  getLogisticsCorreios({ idContract }: IUpdateContract): Promise<IGetLogistics>;

  /**metodo para pegar cep remetente */
  getCepSender({ idSender, idContract }: IUpdateContract): Promise<IGetSender>;

  /**Metodo para pegar lot */
  getLot({ idLot }: IUpdateContract): Promise<IGetLot>;

  /**Metodo para pegar correios_pass */
  getCorreiosPass(user: any): Promise<ICorreiosServicesRequest>;

  /**metodo para salvar Services */
  saveServices({ serviceId, codeInternal, name, details, dateUpdate }: ISaveServices): Promise<ISaveServices>;

  /** metodo para pegar payments logistics */
  getPaymentsLogistics(idTracking: string): Promise<IGetPaymentsLogistics>;

  /**metodo para pegar logisticas pelo contract */
  getLogisticsContract({ contract }: any): Promise<IGetLogistics>;
}
export { ICorreiosRepository };
