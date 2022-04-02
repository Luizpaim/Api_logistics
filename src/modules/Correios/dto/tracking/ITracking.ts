export interface IEventCorreios {
  descricao: string;
  detalhe: string;
  data: string;
  hora: string;
  local: string;
  uf: string;
  cidade: string;
  codigo: string;
  tipo: string;
}

export interface ICorreiosTracking {
  type: string;
  code: string;
  events: {
    status: string;
    date: number;
    description: string;
    message: string;
    local: string;
    cep: string;
    city: string;
    state: string;
  }[];
}

export interface ICorreiosResponse {
  numero: string;
  categoria: string;
  erro?: string;
  evento: IEventCorreios[];
}
