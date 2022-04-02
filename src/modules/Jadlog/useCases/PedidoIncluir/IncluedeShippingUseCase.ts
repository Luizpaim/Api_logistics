// import { responseLogistics } from '@modules/logistics/infra/knex/repositories/ResponseLogistics';
// import { ModeJadlog, Nfe } from '@modules/Jadlog/dto/Enum/ModeJadlog';
// import incluedeShippingQueue from 'src/queue/IncluedeShippingQueue';
// class IncluedeShippingUseCase {
//   constructor() {}

//   public async execute(type: string) {
//     const payload = responseLogistics.lot.map((lot) => {
//       var dimensionsArray = lot.dimensions ? lot.dimensions.split('x') : [null, null, null];
//       return {
//         headers: {
//           authorization: responseLogistics.logistics.jadlogToken,
//         },
//         body: {
//           conteudo: lot.title,
//           pedido: ['123456'], // TODO verificar conteudo
//           totPeso: lot.weight / 1000, // TODO verificar formato do peso
//           totValor: lot.amount,
//           modalidade: ModeJadlog.Package, //TODO ver como vai ser dinamico
//           tpColeta: 'S', //TODO ver se vai ser dinamico
//           rem: {
//             nome: responseLogistics.sender.name,
//             cnpjCpf: responseLogistics.sender.cnpj,
//             endereco: responseLogistics.sender.street,
//             numero: responseLogistics.sender.number,
//             compl: responseLogistics.sender.complement,
//             bairro: responseLogistics.sender.neighborhood,
//             cidade: responseLogistics.sender.city,
//             uf: responseLogistics.sender.state,
//             cep: responseLogistics.sender.postalcode,
//           },
//           des: {
//             nome: lot.name,
//             cnpjCpf: lot.document,
//             endereco: lot.street,
//             numero: lot.number,
//             compl: lot.complment,
//             bairro: lot.neighborhood,
//             cidade: lot.city,
//             uf: lot.state,
//             cep: lot.postalCode,
//           },
//           dfe: [
//             {
//               //TODO VER PARADA DA SERIE
//               nrDoc: lot.nfeKey.chave,
//               tpDocumento: Nfe.Declaracao,
//             },
//           ],
//           volume: [
//             {
//               altura: dimensionsArray[0],
//               comprimento: dimensionsArray[2],
//               largura: dimensionsArray[1],
//               peso: lot.weight / 1000, //TODO Verificar formato do peso
//             },
//           ],
//         },
//       };
//     });

//     for await (const data of payload) {
//       await incluedeShippingQueue.add(data);
//     }
//     return payload;
//   }
// }
// export { IncluedeShippingUseCase };
