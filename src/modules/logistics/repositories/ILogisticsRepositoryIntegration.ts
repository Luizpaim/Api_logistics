import {
    IUpdateContract,
    IGetLogistics,
    IGetSender,
    IGetLot
} from '@modules/logistics/dtos/ILogistics';
interface ILogisticsRepositoryIntegration {
  
    updateContract({ idContract, idSender }: IUpdateContract): Promise<boolean>;
    getLogistics({
        idContract,
        idSender
    }: IUpdateContract): Promise<IGetLogistics>;
    getSender({ idContract, idSender }: IUpdateContract): Promise<IGetSender>;
    getLot({ idContract, idSender }: IUpdateContract): Promise<IGetLot>;
}
export { ILogisticsRepositoryIntegration };
