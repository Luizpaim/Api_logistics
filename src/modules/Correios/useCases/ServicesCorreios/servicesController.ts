import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { ServicesUseCase } from './servicesUseCase';
import { ICorreiosServicesInput } from '@modules/Correios/dto/ServicesCorreios/IServices';
class ServicesController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { user, password, postalCard, contractId } = request.body as ICorreiosServicesInput;
    const servicesUseCase = container.resolve(ServicesUseCase);

    const correiosPass = await servicesUseCase.execute({
      user,
      password,
      postalCard,
      contractId,
    });
    return response.status(200).json(correiosPass);
  }
}

export { ServicesController };
