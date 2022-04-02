import { Router } from 'express';
import { TrackingController } from '@modules/Correios/useCases/Tracking/TrackingController';
import trackingCorreiosValidator from '../validator/trackingCorreiosValidator';
import { authRoleIn, headerAuth } from '@b4-org/middleware-express';

const trackingController = new TrackingController();
const Tracking = Router();
Tracking.post('/', trackingCorreiosValidator.trackingCorreios, headerAuth, authRoleIn(['admin', 'producer']), trackingController.handle);
export default Tracking;
