import { container } from "tsyringe";
import { Request, Response } from "express";
import { TrackingUseCase } from "./TrackingUseCase";

class TrackingController {
  public async handle(request: Request, response: Response): Promise<Response> {
    const { trackingCode } = request.body;
    const trackinguseCase = container.resolve(TrackingUseCase);
    const tracking = await trackinguseCase.execute({ trackingCode });
    return response.status(200).json(tracking);
  }
}
export { TrackingController };
