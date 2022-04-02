import { Router } from 'express';
import { ValidadeContractController } from '@modules/Correios/useCases/Validatecontract/ValidateContractController';
import validateContractCorreiosValidator from '../validator/validateContractCorreiosValidator';
import { authRoleIn, headerAuth } from '@b4-org/middleware-express';

const validateContractController = new ValidadeContractController();
const ValidateContract = Router();

ValidateContract.post(
  '/',
  validateContractCorreiosValidator.validateContract,
  headerAuth,
  authRoleIn(['admin', 'producer']),
  validateContractController.handle
);
export default ValidateContract;
