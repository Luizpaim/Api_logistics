import { ICalculatePriceResponse } from '@b4-org/carteiro';

export interface ICorreiosPrices {
  idContract: string;
  idSender: string;
  objects: {
    cepDestination: string;
    planId: string;
  }[];
}

export interface ICorreiosPricesResponse {
  amount: number;
  amountWithoutAdditional: number;
  objects: ICalculatePriceResponse[];
}

export interface IObjectCorreio {
  type: '1' | '2' | '3';
  height: string;
  width: string;
  length: string;
  diameter: string;
}

export interface IIfValueIsSmaller {
  value: string;
  limit: number;
  elseValue: number;
}
