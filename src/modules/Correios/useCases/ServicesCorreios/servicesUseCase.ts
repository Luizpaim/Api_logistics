import { ICorreiosServicesResponse, ICorreiosServicesInput } from '@modules/Correios/dto/ServicesCorreios/IServices';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';
import { inject, injectable } from 'tsyringe';
import { responseCorreios } from '@modules/Correios/infra/knex/repositories/ResponseCorreios';
import { Sigep } from '@b4-org/carteiro';
import { AppError } from '@b4-org/middleware-express';

@injectable()
class ServicesUseCase {
  constructor(
    @inject('CorreiosRepository')
    private CorreiosRepository?: ICorreiosRepository
  ) {}

  public async execute({ user, password, postalCard, contractId }: ICorreiosServicesInput): Promise<ICorreiosServicesResponse[]> {
    try {
      let passwordIntern: string;
      if (!password) {
        await this.CorreiosRepository.getCorreiosPass(user);
        passwordIntern = responseCorreios.correiosPass;
      }

      // const sigep = await Sigep({
      //   env: 'production',
      //   access: {
      //     user: `${user}`,
      //     password: `${password || passwordIntern}`,
      //   },
      //   postcard: postalCard,
      // });

      const sigep = await Sigep({
        env: 'development',
        access: {
          user: `sigep`,
          password: `n5f9t8`,
        },
        postcard: '0067599079',
      });

      const services = await sigep.searchServices(contractId);
      for await (const service of services) {
        if (!responseCorreios.ServicesCodes[service.id]) {
          responseCorreios.ServicesCodes[service.id] = service.codeInternal;
          await this.CorreiosRepository.saveServices({
            serviceId: service.id,
            codeInternal: service.codeInternal,
            name: service.name,
            details: service.details.category.toLowerCase(),
            dateUpdate: new Date(service.dateUpdate),
          }).catch(() => {
            throw new AppError([
              {
                message: `Service exist`,
                code: 'SERVICE_EXIST',
              },
            ]);
          });
        }
      }
      return services;
    } catch (error) {
      throw new AppError([
        {
          message: `${error.message}`,
          code: 'iNTERNAL',
        },
      ]);
    }
  }
}
export { ServicesUseCase };
