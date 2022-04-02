import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { PriceUseCase } from './PriceUseCase';

interface IBodyLogistics {
  idLot?: string;
  idSender?: string;
  idContract?: string;
}

class PriceController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { idContract, idSender, idLot } = request.body as IBodyLogistics;
    const priceUseCase = container.resolve(PriceUseCase);
    const logistics = await priceUseCase.execute({
      idContract,
      idSender,
      idLot,
    });
    return response.status(200).json(logistics);
  }
}
export { PriceController };
