import { AppError } from '@b4-org/middleware-express';
import { ICorreiosTracking, ICorreiosResponse } from '@modules/Correios/dto/tracking/ITracking';
const TrackingCorreios = require('tracking-correios');

class TrackingUseCase {
  public async execute({ trackingCode }: any): Promise<ICorreiosTracking> {
    try {
      const resultCorreiosList: Array<ICorreiosResponse> = await TrackingCorreios.track([trackingCode], {
        username: process.env.SRO_USER,
        password: process.env.SRO_PASSWORD,
        filter: false,
      });

      const tracking = resultCorreiosList[0];

      return {
        type: tracking.categoria,
        code: trackingCode,
        events: tracking.evento.map((event) => {
          const date = event.data.split('/');

          return {
            status: event.tipo,
            date: new Date(`${date[2]}-${date[1]}-${date[0]} ${event.hora}`).getTime(),
            description: event.descricao,
            message: event.detalhe,
            local: event.local,
            cep: event.codigo,
            city: event.cidade,
            state: event.uf,
          };
        }),
      };
    } catch (error) {
      throw new AppError([
        {
          message: `Validação Solicitar o Campo ${error.message} não é permitido`,
          code: 'VALIDATION_REQUESTING_THE_FIELD_IS_NOT_ALLOWED',
        },
      ]);
    }
  }
}
export { TrackingUseCase };
