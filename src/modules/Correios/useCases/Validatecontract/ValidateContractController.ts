import { container } from "tsyringe";
import { Request, response, Response } from "express";
import { ValidateContractUseCase } from "./ValidateContractUseCase";
import { ValidateContractInput } from "@modules/Correios/dto/ValidateContract/IValidateContract";

class ValidadeContractController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { user, password, postalCard } =
      request.body as ValidateContractInput;
    const validateContractUseCase = container.resolve(ValidateContractUseCase);

    const validateContract = await validateContractUseCase.execute({
      user,
      password,
      postalCard,
    });
    return response.status(200).json(validateContract);
  }
}

export { ValidadeContractController };
