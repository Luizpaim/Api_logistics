import { Router, Application } from 'express';
import globalValidator from '../validator/globalValidator';
// import SearchTag from './searchTag.Routes';
import Logistics from './logistics.Routes';
import PriceCorreios from './priceCorreios.Routes';
import Services from './services.Routes';
import ValidateContract from './validateContract.Routes';
import BlockObject from './blockObject.Routes';
import Tracking from './tracking.Routes';

const routes = (app: Application): void => {
  const Routes = Router();
  const routePrefix = process.env.NODE_ENV === 'production' ? '/' : '/sandbox/';

  app.use(routePrefix, Routes);
  Routes.use(globalValidator);

  Routes.use('/logistics/insertfreight', Logistics);
  Routes.use('/logistics/priceCorreios', PriceCorreios);
  Routes.use('/logistics/servicesCorreios', Services);
  Routes.use('/logistics/validateContractCorreios', ValidateContract);
  Routes.use('/logistics/blockObjectCorreios', BlockObject);
  Routes.use('/logistics/trackingCorreios', Tracking);
};

export default routes;
