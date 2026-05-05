export interface ProdutoFormData {
  nome: string;
  categoria: string;
  preco: string;
  sizes: string[];
  descricao: string;
  imagem: File | null;
}

export interface IAAnalysisResult {
  ok: boolean;
  product: {
    name: string;
    category: string;
    description: string;
    price: string;
    sizes: string[];
  };
  error?: string;
}
