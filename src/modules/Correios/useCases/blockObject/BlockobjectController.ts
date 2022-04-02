import { container } from "tsyringe";
import { Request, Response } from "express";
import { BlockObjectUseCase } from "./BlockIbjectUseCase";
import { IBlockObjectInput } from "@modules/Correios/dto/BlockObject/IBlockObject";

class BlockObjectController {
  public async handle(
    request: Request,
    response: Response
  ): Promise<Response> {
    const {idPlp, idTracking } = request.body as IBlockObjectInput
    const blockObjectUseCase = container.resolve(BlockObjectUseCase);

    const blockObject = await blockObjectUseCase.execute({ idPlp, idTracking });
    return response.status(200).json(blockObject);
  }
}
export { BlockObjectController };
