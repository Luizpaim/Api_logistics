import { Router } from 'express';
import { BlockObjectController } from '@modules/Correios/useCases/blockObject/BlockobjectController';
import blockObjectCorreiosValidator from '../validator/blockObjectCorreiosValidator';
import { authRoleIn, headerAuth } from '@b4-org/middleware-express';

const blockObjectController = new BlockObjectController();
const BlockObject = Router();

BlockObject.post('/', blockObjectCorreiosValidator.blockObject, headerAuth, authRoleIn(['admin', 'producer']), blockObjectController.handle);
export default BlockObject;
