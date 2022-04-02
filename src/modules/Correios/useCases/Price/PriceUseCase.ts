import { inject, injectable } from 'tsyringe';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';
import { ICorreiosPrices, ICorreiosPricesResponse, IObjectCorreio, IIfValueIsSmaller } from '@modules/Correios/dto/Price/IPrice';
import { responseCorreios } from '@modules/Correios/infra/knex/repositories/ResponseCorreios';
import { WS } from '@b4-org/carteiro';
import { AppError } from '@b4-org/middleware-express';
export type IRequestLogistics = {
  idLot?: string;
  idSender?: string;
  idContract?: string;
};

@injectable()
class PriceUseCase {
  constructor(
    @inject('CorreiosRepository')
    private CorreiosRepository?: ICorreiosRepository
  ) {}

  public async execute({ idContract, idSender, idLot }: IRequestLogistics): Promise<ICorreiosPricesResponse> {
    await this.CorreiosRepository.getLogisticsCorreios({ idContract });
    await this.CorreiosRepository.getCepSender({ idSender, idContract });
    await this.CorreiosRepository.getLot({ idLot });
    const ifValueIsSmaller = ({ value, limit, elseValue }: IIfValueIsSmaller) => {
      if (parseInt(value, 10) < limit) {
        return elseValue;
      }
      return parseInt(value, 10);
    };
    const createObjectCorreios = (format: 'box' | 'envelope' | 'roll', dimensions: string): IObjectCorreio => {
      switch (format) {
        case 'roll':
          const dimensionsRoll = dimensions.split('x');
          return {
            type: '2',
            height: dimensionsRoll[0],
            width: dimensionsRoll[1],
            length: dimensionsRoll[2],
            diameter: dimensionsRoll[3],
          };
        case 'envelope':
          const dimensionsEnvelope = dimensions.split('x');
          return {
            type: '3',
            height: '0',
            width: dimensionsEnvelope[0],
            length: dimensionsEnvelope[1],
            diameter: '0',
          };
        default:
          // box too
          const dimensionsBox = dimensions.split('x');
          return {
            type: '1',
            height: dimensionsBox[0],
            width: dimensionsBox[1],
            length: dimensionsBox[2],
            diameter: '0',
          };
      }
    };
    try {
      const ws = await WS({
        access: {
          user: '17000190',
          password: 'n5f9t8',
        },
      });

      //   const ws = await WS({
      //     access: {
      //         user: `${responseCorreios.correiosAdmCode}`,
      //         password: responseCorreios.correiosPass
      //     }
      // });

      const objectsPromise = responseCorreios.lot.map((object) => {
        const plan = responseCorreios.lot.filter((planItem) => planItem.id === parseInt(object.id, 10)[0]);

        const objectValues = createObjectCorreios(object.format, object.dimensions);

        return ws.getPrice({
          idService: '41300',
          cepSender: responseCorreios.postalcode,
          cepPostal: object.cepDestination,
          weight: object.weight,
          type: objectValues.type,
          height: objectValues.height,
          width: objectValues.width,
          length: `${ifValueIsSmaller({
            value: objectValues.length,
            limit: 16,
            elseValue: 16,
          })}`,
          diameter: objectValues.diameter,
          handDelivery: 'S',
          declaredValue: object.amount.toFixed(),
          alertSended: 'S',
        });
      });

      const objects = await Promise.all(objectsPromise);

      return {
        amount:
          objects
            .map((object) => object.amount * 100)
            .reduce((amount, objectAmount) => {
              return amount + objectAmount;
            }) / 100,
        amountWithoutAdditional:
          objects
            .map((object) => object.priceWithoutAdditional * 100)
            .reduce((amount, objectAmount) => {
              return amount + objectAmount;
            }) / 100,
        objects: objects.map((object) => object),
      };
    } catch (error) {
      throw new AppError([
        {
          message: `Erro ao verificar o preço : ${error.message}`,
          code: 'ERRO_CHECKING_PRICE',
        },
      ]);
    }
  }
}
export { PriceUseCase };
