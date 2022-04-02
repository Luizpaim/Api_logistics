import { IBlockObjectInput, IBlockObjectResponse } from '@modules/Correios/dto/BlockObject/IBlockObject';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';
import { inject, injectable } from 'tsyringe';
import { responseCorreios } from '@modules/Correios/infra/knex/repositories/ResponseCorreios';
import { Sigep } from '@b4-org/carteiro';
import { AppError } from '@b4-org/middleware-express';

@injectable()
class BlockObjectUseCase {
  constructor(
    @inject('CorreiosRepository')
    private CorreiosRepository: ICorreiosRepository
  ) {}

  public async execute({ idPlp, idTracking }: IBlockObjectInput): Promise<IBlockObjectResponse> {
    try {
      await this.CorreiosRepository.getPaymentsLogistics( idTracking );
      await this.CorreiosRepository.getLogisticsContract({
        contract: responseCorreios.contract,
      });
      if (!responseCorreios.correiosUser && !responseCorreios.correiosPass && !responseCorreios.correiosPostcard) {
        throw new AppError([
          {
            message: 'Contrato inválido!',
            code: 'INVALID_CONTRACT!',
          },
        ]);
      }

      if (!responseCorreios.trackingCode) {
        throw new AppError([
          {
            message: 'Código de rastreamento inválido!',
            code: 'INVALID TRACKING_CODE',
          },
        ]);
      }
      // const sigep = await Sigep({
      //   env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
      //   access: {
      //     user: 'sigep',
      //     password: 'n5f9t8',
      //   },
      //   postcard: '0067599079',
      // });

      const sigep = await Sigep({
        env:
            process.env.NODE_ENV === 'production'
                ? 'production'
                : 'development',
        access: {
            user: `${responseCorreios.correiosUser}`,
            password: responseCorreios.correiosPass
        },
        postcard: responseCorreios.correiosPostcard
    });

      await sigep.blockObject(idPlp, responseCorreios.trackingCode);
      return {
        status: true,
      };
    } catch (error) {
      throw new AppError([
        {
          message: `${error.message}`,
          code: 'INTERNAL',
        },
      ]);
    }
  }
}
export { BlockObjectUseCase };
