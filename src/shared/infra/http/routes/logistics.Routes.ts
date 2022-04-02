import { Router } from 'express';
import { LogisticsController } from '@modules/logistics/useCases/logistics/logisticsController';
import senderValidator from '../validator/senderValidator';
import { authRoleIn, headerAuth } from '@b4-org/middleware-express';

const logisticsController = new LogisticsController();
const Logistics = Router();
Logistics.post('/', senderValidator.updateContract, headerAuth, authRoleIn(['admin', 'producer']), logisticsController.handle);
export default Logistics;
