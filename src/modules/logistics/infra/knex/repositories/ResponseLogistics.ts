import { insertFreightUseCase } from '@modules/melhorEnvio/useCases/insertFreight/insertfreightUseCase';
import { TagUseCase } from '@modules/Correios/useCases/Tag/TagUseCase';
import { AppError } from '@b4-org/middleware-express';

class ResponseLogistics {
  /**Logistics */
  logistics: {
    /**Correios */
    id: string;
    type: string;
    correiosUser: string;
    correiosPass: string;
    correiosPostcard: string;
    correiosContractNumber: string;
    correiosAdmCode: string;
    correiosServicePac: string;
    correiosServiceSedex: string;
    correiosServiceCarta: string;
    correiosServiceMinienvios: string;
    /**Melhor Envio */
    melhorenvioEmail: string;
    melhorEnvioToken: string;
    /**Jad Log */
    jadlogToken: string;
  };
  /**remetente */
  sender: {
    id: string;
    name: string;
    telephone: string;
    email: string;
    cnpj: string;
    street: string;
    complement: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    postalcode: string;
    directors: string;
  };
  /**Lot e informações do destinatario */
  lot: [
    {
      paymentId: string;
      type: string;
      upsellOid: number;
      name: string;
      phoneNumber: string;
      email: string;
      document: string;
      street: string;
      complment: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      postalCode: string;
      title: string;
      units: string;
      weight: number;
      dimensions: string;
      amount: string;
      format: string;
      nfeKey: {
        chave: string;
        number: string;
        serie: string;
        value: string;
      };
    }
  ];
  /**Metodo para salvar logisticas */
  public async setLogistics(logistics) {
    this.logistics = {
      id: logistics.id,
      correiosUser: logistics.correiosUser,
      correiosPass: logistics.correiosPass,
      correiosPostcard: logistics.correiosPostcard,
      correiosContractNumber: logistics.correiosContractNumber,
      correiosAdmCode: logistics.correiosAdmCode,
      correiosServicePac: logistics.correiosServicePac,
      correiosServiceSedex: logistics.correiosServiceSedex,
      correiosServiceCarta: logistics.correiosServiceCarta,
      correiosServiceMinienvios: logistics.correiosServiceMinienvios,
      type: logistics.type,
      melhorenvioEmail: logistics.melhorenvioEmail,
      melhorEnvioToken: logistics.melhorenvioToken,
      jadlogToken: logistics.jadlogToken,
    };
    return;
  }
  /**Metodo para salvar remetente */
  public async setSender(logisticsSender) {
    this.sender = {
      id: logisticsSender.id,
      name: logisticsSender.name,
      telephone: logisticsSender.telephone,
      email: logisticsSender.email,
      cnpj: logisticsSender.cnpj,
      street: logisticsSender.street,
      complement: logisticsSender.complement,
      number: logisticsSender.number,
      neighborhood: logisticsSender.neighborhood,
      city: logisticsSender.city,
      state: logisticsSender.state,
      postalcode: logisticsSender.postalcode,
      directors: logisticsSender.directors,
    };

    return;
  }
  /**Metodo para salvar LOT */
  public async setLot(logisticsLot) {
    this.lot = logisticsLot;
    return;
  }
  /**Metodo para validar tipo melhoenvio | correios */
  public async checkType() {
    /**Verifica se é do tipo melhor envio */
    if (this.logistics.type === 'melhorenvio') {
      /**verifica se veio tokek e email */
      if (this.logistics.melhorenvioEmail && this.logistics.melhorEnvioToken) {
        /**verifica se veio remetente */
        if (
          !this.sender.name &&
          !this.sender.telephone &&
          !this.sender.email &&
          !this.sender.street &&
          !this.sender.complement &&
          !this.sender.number &&
          !this.sender.neighborhood &&
          !this.sender.city &&
          !this.sender.state &&
          !this.sender.postalcode &&
          !this.sender.directors
        ) {
          throw new AppError([
            {
              message: 'Remetente inválido!',
              code: 'INVALID_SENDER!',
            },
          ]);
        }
        if (
          !this.lot[0].name ||
          !this.lot[0].phoneNumber ||
          !this.lot[0].email ||
          !this.lot[0].document ||
          !this.lot[0].number ||
          !this.lot[0].neighborhood ||
          !this.lot[0].city ||
          !this.lot[0].state ||
          !this.lot[0].postalCode
        ) {
          throw new AppError([
            {
              message: 'Lote sem destinatario cadastrados!',
              code: 'LOT_WITHOUT_REDISTERED_DESTINATION!',
            },
          ]);
        }
        if (
          !this.lot[0].title ||
          !this.lot[0].units ||
          !this.lot[0].weight ||
          !this.lot[0].dimensions ||
          !this.lot[0].amount ||
          !this.lot[0].format
        ) {
          throw new AppError([
            {
              message: 'Lote sem produtos cadastrados!',
              code: 'LOT_WITHOUT_REGISTERED_PRODUCTS!',
            },
          ]);
        }
        /**envia para rota melhor envio */
        const melhorenvioType = new insertFreightUseCase();
        return await melhorenvioType.melhorenvioType(this.logistics.type);
      }
      /**Resposta se vim null informações obrigatórias para melhor envio */
      throw new AppError([
        {
          message: 'E-mail ou Token Melhor Envio não configurados!',
          code: 'EMAIL_OF_MELHOR_ENVIO_TOKEN_NOT_CONFIGURED!',
        },
      ]);
    } else if (this.logistics.type === 'correios') {
      /** Verifica se é do tipo correios */
      return await new TagUseCase().execute(this.sender.id);
    }
    // } else if (this.logistics.type === 'jadlog') {
    //   return await new IncluedeShippingUseCase().execute(this.logistics.type);
    // }
    throw new AppError([
      {
        message: 'Nenhum contrato configurado',
        code: 'NO_CONTRACT_CONFIGURED!',
      },
    ]);
  }
}

export const responseLogistics = new ResponseLogistics();
