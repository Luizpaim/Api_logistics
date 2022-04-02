import { container } from 'tsyringe';
/**Container Logisticas */
import { LogisticsRepositoryIntegration } from '@modules/logistics/infra/knex/repositories/LogisticsRepositoryIntegration';
import { ILogisticsRepositoryIntegration } from '@modules/logistics/repositories/ILogisticsRepositoryIntegration';

container.registerSingleton<ILogisticsRepositoryIntegration>('LogisticsRepositoryIntegration', LogisticsRepositoryIntegration);

/**Container Correios */
import { CorreiosRepository } from '@modules/Correios/infra/knex/repositories/CorreiosRepository';
import { ICorreiosRepository } from '@modules/Correios/repositories/ICorreiosRepository';

container.registerSingleton<ICorreiosRepository>('CorreiosRepository', CorreiosRepository);
