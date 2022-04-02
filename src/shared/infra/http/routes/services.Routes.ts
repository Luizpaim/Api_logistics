import { Router } from 'express';
import { ServicesController } from '@modules/Correios/useCases/ServicesCorreios/servicesController';
import servicesCorreiosValidator from '../validator/servicesCorreiosvalidator';
import { authRoleIn, queryAuth } from '@b4-org/middleware-express';

const servicesController = new ServicesController();
const Services = Router();

Services.get('/', servicesCorreiosValidator.servicesCorreios, queryAuth, authRoleIn(['admin', 'producer']), servicesController.handle);
export default Services;
