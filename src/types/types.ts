export interface Caixa {
  altura: number;
  largura: number;
  comprimento: number;
  volume: number;
  nome: string;
}

export interface Produto {
  produto_id: string;
  dimensoes: {
    altura: number;
    largura: number;
    comprimento: number;
  };
  volume: number;
}

export interface CaixaResponse {
  caixa_id: string | null;
  produtos: string[];
  observacao?: string;
}

export interface PedidoResponse {
  pedido_id: number;
  caixas: CaixaResponse[];
}

export interface PedidosResponse {
  pedidos: PedidoResponse[];
}
