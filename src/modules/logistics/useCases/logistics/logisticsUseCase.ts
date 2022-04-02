import { inject, injectable } from 'tsyringe';
import { ILogisticsRepositoryIntegration } from '@modules/logistics/repositories/ILogisticsRepositoryIntegration';
import { responseLogistics } from '@modules/logistics/infra/knex/repositories/ResponseLogistics';

export type IRequestLogistics = {
  idLot?: string;
  idSender?: string;
  idContract?: string;
};

@injectable()
class LogisticsUseCase {
  constructor(
    @inject('LogisticsRepositoryIntegration')
    private LogisticsRepositoryIntegration?: ILogisticsRepositoryIntegration
  ) {}

  public async execute({ idLot, idSender, idContract }: IRequestLogistics): Promise<any> {
    await this.LogisticsRepositoryIntegration.updateContract({
      idLot,
      idSender,
    });
    await this.LogisticsRepositoryIntegration.getLogistics({
      idContract,
      idSender,
    });
    await this.LogisticsRepositoryIntegration.getSender({
      idContract,
      idSender,
    });
    await this.LogisticsRepositoryIntegration.getLot({ idLot });
    return await responseLogistics.checkType();
  }
}

export { LogisticsUseCase };
