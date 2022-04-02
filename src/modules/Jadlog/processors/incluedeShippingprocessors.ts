// import { AppError } from '@b4-org/middleware-express';
// import axios from 'axios';
// import { DoneCallback, Job } from 'bull';
// import { headersAxios } from '../useCases/PedidoIncluir/HeadersAxios';

// export async function includeShippingProcessors(job: Job, done: DoneCallback) {
//   try {
//     const { headers, body } = job.data;
//     const config: object = {
//       method: headersAxios.method,
//       url: headersAxios.url,
//       headers: {
//         Accept: 'application/json',
//         'Content-type': headersAxios.contentType,
//         Authorization: headers.authorization,
//       },
//       data: body,
//     };
//     const res = await axios(config);

//     /**Metodo para salvar */

//     console.log(res.data);
//     return done();
//   } catch (error) {
//     console.log(error);
//     console.log(error!.response!.data);

//     throw new AppError([
//       {
//         message: error!.response!.data,
//         code: 'NO_CONTRACT_CONFIGURED!', //TODO RESOLVER essa parada
//       },
//     ]);
//   }
// }
