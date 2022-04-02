import { responseLogistics } from '@modules/logistics/infra/knex/repositories/ResponseLogistics';
import insertFreightQueue from 'src/queue/insertFreightQueue';

class insertFreightUseCase {
  constructor() {}
  public async melhorenvioType(type: string) {
    const payload = responseLogistics.lot.map((lot) => {
      var dimensionsArray = lot.dimensions ? lot.dimensions.split('x') : [null, null, null];
      return {
        headers: {
          authorization: 'Bearer ' + responseLogistics.logistics.melhorEnvioToken,
          userAgent: responseLogistics.logistics.melhorenvioEmail,
        },
        body: {
          service: 1,
          from: {
            name: responseLogistics.sender.name,
            phone: responseLogistics.sender.telephone,
            email: responseLogistics.sender.email,
            company_document: responseLogistics.sender.cnpj,
            address: responseLogistics.sender.street,
            complement: responseLogistics.sender.complement,
            number: responseLogistics.sender.number,
            district: responseLogistics.sender.neighborhood,
            city: responseLogistics.sender.city,
            postal_code: responseLogistics.sender.postalcode,
            note: '',
          },
          to: {
            name: lot.name,
            phone: lot.phoneNumber,
            email: lot.email,
            document: lot.document,
            address: lot.street,
            complement: lot.complment,
            number: lot.number,
            district: lot.neighborhood,
            city: lot.city,
            state_abbr: lot.state,
            postal_code: lot.postalCode,
            note: '',
          },
          products: [
            {
              name: lot.title,
              quantity: lot.units,
              unitary_value: lot.amount,
            },
          ],
          volumes: [
            {
              height: dimensionsArray[0],
              width: dimensionsArray[1],
              length: dimensionsArray[2],
              weight: lot.weight / 1000,
            },
          ],
          options: {
            receipt: false,
            reverse: false,
            non_commercial: false,
            invoice: {
              key: lot.nfeKey.chave,
            },
            platform: 'B4',
            tags: [
              {
                tag: lot.paymentId,
                url: '',
              },
            ],
          },
        },
      };
    });
    for await (const data of payload) {
      await insertFreightQueue.add(data);
    }

    return {
      paymentId: payload[0].body.options.tags[0].tag,
      remetente: payload[0].body.from,
      destinatario: payload[0].body.to,
      produtos: payload[0].body.products,
      volumes: payload[0].body.volumes,
    };
  }
}
export { insertFreightUseCase };
