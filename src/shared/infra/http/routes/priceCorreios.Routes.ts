import { Router } from 'express';
import { PriceController } from '@modules/Correios/useCases/Price/PriceController';
import priceCorreiosValidator from '../validator/priceCorreiosValidator';
import { authRoleIn, queryAuth } from '@b4-org/middleware-express';

const priceController = new PriceController();
const PriceCorreios = Router();
PriceCorreios.get('/', priceCorreiosValidator.priceCorreios, queryAuth, authRoleIn(['admin', 'producer']), priceController.handle);
export default PriceCorreios;
