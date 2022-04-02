import { ISigepResponse } from '@b4-org/carteiro';
import { ITagAmount, IRastreio, IListClients } from '@modules/Correios/dto/Tag/ITag';

class TagController {
  public async handle(list: IListClients[], sigep: ISigepResponse): Promise<ITagAmount[]> {
    const rastreio: IRastreio = {};

    try {
      list.forEach((client) => {
        if (rastreio[`_${client.postServiceCodeLong6}`]) {
          rastreio[`_${client.postServiceCodeLong6}`].amount += 1;
        } else {
          rastreio[`_${client.postServiceCodeLong6}`] = {
            amount: 1,
            code: client.postServiceCodeLong6,
          };
        }
      });

      for await (const service of Object.values(rastreio)) {
        console.log({
          idService: service.code,
          numberTags: service.amount,
        });

        const tags = await sigep.requestTag({
          idService: service.code,
          numberTags: service.amount,
        });

        rastreio[`_${service.code}`].tags = tags;
      }

      return Object.values(rastreio) as ITagAmount[];
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
export const generateTag = new TagController();
export { ITagAmount };
