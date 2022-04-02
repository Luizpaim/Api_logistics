import { container } from 'tsyringe';
import { Request, Response } from 'express';
import { LogisticsUseCase } from './logisticsUseCase';

interface IBodyLogistics {
  idLot?: string;
  idSender?: string;
  idContract?: string;
}
class LogisticsController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { idLot, idSender, idContract } = request.body as IBodyLogistics;
    const logisticsUseCase = container.resolve(LogisticsUseCase);
    const logistics = await logisticsUseCase.execute({ idLot, idSender, idContract });

    return response.status(200).json(logistics);
  }
}
export { LogisticsController };
