import { responseLogistics } from '@modules/logistics/infra/knex/repositories/ResponseLogistics';
import { Sigep, TagsObject, ISenderToPLP, Data, IPLPData } from '@b4-org/carteiro';
import { IObjectCorreio, IObjectSale, Directors, IGenerateCorreiosTag } from '@modules/Correios/dto/Tag/ITag';
import { responseCorreios } from '@modules/Correios/infra/knex/repositories/ResponseCorreios';

import { CorreiosRepository } from '@modules/Correios/infra/knex/repositories/CorreiosRepository';
import { generateTag, ITagAmount } from './TagController';
import { AppError } from '@b4-org/middleware-express';
import { container } from 'tsyringe';

class TagUseCase {
  public async execute(idSender: string): Promise<IGenerateCorreiosTag> {
    /**Validar formato de serviço a ser solicitado aos correios */
    const createObjectCorreios = (format: 'box' | 'envelope' | 'roll', dimensions: string): IObjectCorreio => {
      switch (format) {
        case 'roll':
          const dimensionsRoll = dimensions.split('x').map((itemString) => Number(itemString) || 0);
          return {
            type: '002',
            height: dimensionsRoll[0],
            width: dimensionsRoll[1],
            length: dimensionsRoll[2],
            diameter: dimensionsRoll[3],
          };
        case 'envelope':
          const dimensionsEnvelope = dimensions.split('x').map((itemString) => Number(itemString) || 0);
          return {
            type: '003',
            height: 0,
            width: dimensionsEnvelope[0],
            length: dimensionsEnvelope[1],
            diameter: 0,
          };
        default:
          // box too
          const dimensionsBox = dimensions.split('x').map((itemString) => Number(itemString) || 0);
          return {
            type: '001',
            height: dimensionsBox[0],
            width: dimensionsBox[1],
            length: dimensionsBox[2],
            diameter: 0,
          };
      }
    };

    try {
      /**Verificar se o contrato é válido */
      if (
        !responseLogistics.logistics.correiosUser &&
        !responseLogistics.logistics.correiosPass &&
        !responseLogistics.logistics.correiosPostcard &&
        !responseLogistics.logistics.correiosContractNumber &&
        !responseLogistics.logistics.correiosAdmCode &&
        !responseLogistics.logistics.correiosServicePac &&
        !responseLogistics.logistics.correiosServiceSedex &&
        !responseLogistics.logistics.correiosServiceCarta &&
        !responseLogistics.logistics.correiosServiceMinienvios
      ) {
        throw new AppError([
          {
            message: 'Contrato inválido!',
            code: 'INVALID_CONTRACT!',
          },
        ]);
      }

      /**Verificar se veio alguma modalidade de serviço solicitado invalido */
      if (
        responseLogistics.logistics.correiosServicePac === '0' ||
        responseLogistics.logistics.correiosServiceSedex === '0' ||
        responseLogistics.logistics.correiosServiceCarta === '0' ||
        responseLogistics.logistics.correiosServiceMinienvios === '0'
      ) {
        throw new AppError([
          {
            message: 'Serviços de Pac, Sedex ou Carta não definidos na configuração do contrato!',
            code: 'PAC,_SEDEX,_OR_CHARTER_SERVICES_NOT_DEFINED_IN_THE_CONTRACT_CONFIGURATION!',
          },
        ]);
      }

      /**Objeto para configurar conexão com correios */
      const sigep = await Sigep({
        env: process.env.NODE_ENV === 'production' ? 'production' : 'development',
        access: {
          user: 'sigep',
          password: 'n5f9t8',
        },
        postcard: '0067599079',
        identifierCnpjContract: '34028316000103',
      });

      //   const sigep = await Sigep({
      //     env:
      //         process.env.NODE_ENV === 'production'
      //             ? 'production'
      //             : 'development',
      //     access: {
      //         user: `${responseLogistics.logistics.correiosUser}`,
      //         password: responseLogistics.logistics.correiosPass
      //     },
      //     postcard: responseLogistics.logistics.correiosPostcard,
      //     identifierCnpjContract: responseLogistics.sender.cnpj.
      // });

      /**Validar se o remetente é válido */
      if (
        !responseLogistics.sender.name &&
        !responseLogistics.sender.telephone &&
        !responseLogistics.sender.email &&
        !responseLogistics.sender.street &&
        !responseLogistics.sender.complement &&
        !responseLogistics.sender.number &&
        !responseLogistics.sender.neighborhood &&
        !responseLogistics.sender.city &&
        !responseLogistics.sender.state &&
        !responseLogistics.sender.postalcode &&
        !responseLogistics.sender.directors
      ) {
        throw new AppError([
          {
            message: 'Remetente inválido!',
            code: 'INVALID_SENDER!',
          },
        ]);
      }

      /**Objeto para definir direção de serviço estado */
      const directors = responseLogistics.sender.directors as Directors;

      const senderPLP: ISenderToPLP = {
        numberContract: responseLogistics.logistics.correiosContractNumber,
        numberDirection: Data.NUMBER_DIRECTION[directors].code,
        codeAdminstration: responseLogistics.logistics.correiosAdmCode,
        name: responseLogistics.sender.name,
        street: responseLogistics.sender.street,
        number: responseLogistics.sender.number,
        complement: responseLogistics.sender.complement,
        neighborhood: responseLogistics.sender.neighborhood,
        cep: responseLogistics.sender.postalcode,
        city: responseLogistics.sender.city,
        uf: responseLogistics.sender.state,
        email: responseLogistics.sender.email,
        cpfOrCnpj: responseLogistics.sender.cnpj,
      };

      /**Verificar se o LOT tem vendas cadastradas */
      if (!responseLogistics.lot) {
        throw new AppError([
          {
            message: 'Lote sem vendas cadastradas!',
            code: 'LOT_WITHOUT_REGISTERED_SALES!',
          },
        ]);
      }

      /**Verificar se lote já processado anteriormente */
      if (responseLogistics.lot.filter((lot) => lot.type !== 'temp').length !== 0) {
        throw new AppError([
          {
            message: 'Lote já processado anteriormente!',
            code: 'BATCH_ALREADY_PROCESSED_PREVIOUSLY!',
          },
        ]);
      }

      /**Montar objeto Vendas do Lot */
      const salesObjects: IObjectSale[] = responseLogistics.lot.map((object) => {
        /**verificando e montando objeto de nota fiscal */
        let noteFiscal;
        if (object.nfeKey) {
          noteFiscal = {
            chave: object.nfeKey.chave,
            number: object.nfeKey.number,
            value: object.nfeKey.value,
          };
        }

        /**montando dimensões e formato de objeto a ser enviado */
        const objectValues = createObjectCorreios(object.format, object.dimensions);

        /**verificando modalidade de objeto a ser enviado */
        let postServiceCode: string;
        if (object?.format === 'envelope') {
          postServiceCode = responseLogistics.logistics.correiosServiceCarta;
        } else if (responseLogistics.sender.state === object?.state) {
          postServiceCode = responseLogistics.logistics.correiosServiceSedex;
        } else if (responseLogistics.logistics.correiosServiceMinienvios === '1') {
          postServiceCode = responseLogistics.logistics.correiosServiceMinienvios;
        } else {
          postServiceCode = responseLogistics.logistics.correiosServicePac;
        }

        /**Montando objeto para enviar para correio */
        var objectCorreios: IObjectSale = {
          postServiceCode: responseCorreios.ServicesCodes[postServiceCode],
          postServiceCodeLong6: postServiceCode,
          sale: object.paymentId,
          upSell_id: object.upsellOid,
          tag: '',
          name: object.name,
          document: object.document,
          cell: object.phoneNumber,
          street: object.street,
          complement: object.complment,
          number: object.number,
          neighborhood: object.neighborhood,
          city: object.city,
          uf: object.state,
          cep: object.postalCode,
          noteFiscal,
          cubage: 0,
          weight: Number(object.weight) || 0,
          object: {
            type: objectValues.type,
            diameter: objectValues.diameter,
            height: objectValues.height,
            width: objectValues.width,
            length: objectValues.length,
          },
          additionalService: {
            code: ['025'],
            declaredValue: '',
          },
        };

        return objectCorreios;
      });

      let tags = await generateTag.handle(salesObjects, sigep);

      const tagsWithoutDigit: string[] = [];

      const postalObjects: IObjectSale[] = salesObjects.map((object) => {
        let tagSelected = {} as TagsObject;

        tags = tags.map((tag) => {
          let newTag: ITagAmount;

          if (tag.code === object.postServiceCodeLong6) {
            if (tag.tags) {
              const [firstTag, ...lastTags] = tag.tags;
              tagSelected = firstTag;
              newTag = {
                code: tag.code,
                amount: tag.amount - 1,
                tags: [...lastTags],
              };
            } else {
              newTag = {
                code: tag.code,
                amount: 0,
                tags: [],
              };
            }
          } else {
            newTag = tag;
          }

          return newTag;
        });
        tagsWithoutDigit.push(tagSelected.tagWithoutDigit);
        return {
          ...object,
          tag: tagSelected.tag,
        };
      });
      const plpData: IPLPData = {
        sender: senderPLP,
        postalObjects,
        tags: tagsWithoutDigit,
      };

      const plp = await sigep.closePLPVariousServices(plpData);

      /**Salvar informações retornadas pelo Correios */
      const saveTag = container.resolve(CorreiosRepository);

      for (const tracking of postalObjects) {
        saveTag.saveTag({
          plpId: plp.id,
          tag: tracking.tag,
          contract: parseInt(idSender, 10),
          dimensions: `${tracking.object.height}x${tracking.object.width}x${tracking.object.length}x${tracking.object.diameter}`,
          weight: String(tracking.weight),
          date_updated: new Date(),
          type: 'correios',
          service: tracking.postServiceCodeLong6,
          pid: tracking.sale,
          upSellOid: tracking.upSell_id,
        });
      }

      return {
        message: 'Etiquetas obtidas com sucesso!',
        id: plp.id,
        status: true,
      };
    } catch (error) {
      throw new AppError([
        {
          message: error,
          code: 'INTERNAL',
        },
      ]);
    }
  }
}
export { TagUseCase };
