import { IValidateContractInput, IValidateContractResponse } from '@modules/Correios/dto/ValidateContract/IValidateContract';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';
import { inject, injectable } from 'tsyringe';
import { responseCorreios } from '@modules/Correios/infra/knex/repositories/ResponseCorreios';
import { AppError } from '@b4-org/middleware-express';
import { Sigep } from '@b4-org/carteiro';

@injectable()
class ValidateContractUseCase {
  constructor(
    @inject('CorreiosRepository')
    private CorreiosRepository: ICorreiosRepository
  ) {}

  public async execute({ user, password, postalCard }: IValidateContractInput): Promise<IValidateContractResponse> {
    try {
      let passwordIntern;
      if (!password) {
        await this.CorreiosRepository.getCorreiosPass(user);
        passwordIntern = responseCorreios.correiosPass;
      }

      const sigep = await Sigep({
        env: `development`,
        access: {
          user: `${user}`,
          password: `${password || passwordIntern}`,
        },
        postcard: postalCard,
      });
      
    //   const sigep = await Sigep({
    //     env: 'production',
    //     access: {
    //         user: `${user}`,
    //         password: `${password || passwordIntern}`
    //     },
    //     postcard: postalCard
    // });

      try {
        const status = await sigep.statusPostalCard();
        return {
          status: status === 'activated',
          message: 'Contrato validado com sucesso!',
        };
      } catch (error) {
        return {
          status: false,
          message: error.message,
        };
      }
    } catch (error) {
      throw new AppError([
        {
          message: `Erro ao validar contrato: ${error.message}`,
          code: 'ERROR_IN_VALIDATING_CONTRACT',
        },
      ]);
    }
  }
}
export { ValidateContractUseCase };
