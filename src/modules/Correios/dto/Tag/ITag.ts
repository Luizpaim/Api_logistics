import { TagsObject, IObjectToPLP } from '@b4-org/carteiro';
export interface IGenerateCorreiosTag {
  status: boolean;
  id: string;
  message: string;
}
export interface IGenerateTagInput {
  idContract: string;
  idSender: string;
  idLot: string;
}
export interface IObjectSale extends IObjectToPLP {
  sale: string;
  upSell_id?: number;
  postServiceCode: string;
  postServiceCodeLong6: string;
}
export interface IObjectCorreio {
  type: '001' | '002' | '003';
  height: number;
  width: number;
  length: number;
  diameter: number;
}
export type Directors =
  | 'CS'
  | 'ACR'
  | 'AL'
  | 'AM'
  | 'AP'
  | 'BA'
  | 'BSB'
  | 'CE'
  | 'ES'
  | 'GO'
  | 'MA'
  | 'MG'
  | 'MS'
  | 'MT'
  | 'PA'
  | 'PB'
  | 'PE'
  | 'PI'
  | 'PR'
  | 'RJ'
  | 'RN'
  | 'RO'
  | 'RR'
  | 'RS'
  | 'SC'
  | 'SE'
  | 'SPI'
  | 'SPM'
  | 'TO';
export interface ITagAmount {
  code: string;
  amount: number;
  tags?: TagsObject[];
}

export interface IRastreio {
  [key: string]: ITagAmount;
}

export interface IListClients {
  postServiceCodeLong6: string;
}

export interface ISaveTag {
  plpId: string;
  tag: string;
  contract: number;
  dimensions: string;
  weight: string;
  date_updated: Date;
  type: string;
  service: string;
  pid: string;
  upSellOid: number;
}
