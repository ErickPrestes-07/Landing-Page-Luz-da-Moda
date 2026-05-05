import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { UploadCloud, CheckCircle, X } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import './ProductForm.css';

const AVAILABLE_SIZES = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'G4'];
const CATEGORIES = ['vestidos', 'blusas', 'calcas', 'camisas', 'conjuntos'];

const productSchema = z.object({
  nome: z.string().min(3, 'Nome muito curto'),
  categoria: z.string().min(1, 'Selecione uma categoria'),
  preco: z.string().min(1, 'Informe o preço'),
  descricao: z.string().max(1000, 'Descrição muito longa'),
  tamanhos: z.array(z.string()).min(1, 'Selecione ao menos um tamanho'),
});

type ProductFormData = z.infer<typeof productSchema>;

const ProductForm: React.FC<{ onSuccess?: (p: any) => void }> = ({ onSuccess }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { nome: '', categoria: 'vestidos', preco: 'R$ 0,00', descricao: '', tamanhos: [] },
  });

  const selectedSizes = watch('tamanhos') || [];
  const selectedCat = watch('categoria');

  const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    const current = [...selectedSizes];
    const index = current.indexOf(size);
    if (index > -1) current.splice(index, 1);
    else current.push(size);
    setValue('tamanhos', current, { shouldValidate: true });
  };

  const onSubmit = async (data: ProductFormData) => {
    const newProduct = {
      id: Date.now().toString(),
      name: data.nome,
      category: data.categoria,
      price: data.preco,
      description: data.descricao,
      sizes: data.tamanhos,
      image: preview || '/images/piece-blusa.jpg'
    };
    const stored = localStorage.getItem('luzDaModaProducts');
    const products = stored ? JSON.parse(stored) : [];
    products.push(newProduct);
    localStorage.setItem('luzDaModaProducts', JSON.stringify(products));
    toast.success('Cadastrado com sucesso!');
    if (onSuccess) onSuccess(newProduct);
  };

  return (
    <div className="pf-container">
      <Toaster position="bottom-center" richColors />
      
      {/* Lado Esquerdo: Imagem */}
      <div className="pf-sidebar">
        <label className="pf-label">Mídia do Produto</label>
        <div className="pf-dropzone">
          <input type="file" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} onChange={onImageChange} accept="image/*" />
          {preview ? (
            <img src={preview} className="pf-preview" alt="Preview" />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <UploadCloud size={48} color="#f9c9df" style={{ marginBottom: '15px' }} />
              <p style={{ fontWeight: '800', color: '#bbb' }}>Arraste ou Clique</p>
            </div>
          )}
          {preview && (
            <button type="button" onClick={() => setPreview(null)} style={{ position: 'absolute', top: '15px', right: '15px', background: '#e53e3e', color: 'white', border: 'none', borderRadius: '50%', width: '30px', height: '30px', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Lado Direito: Dados */}
      <div className="pf-main">
        <h2 className="pf-title">Novo Cadastro</h2>
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pf-field-group">
            <label className="pf-label">Nome da Peça</label>
            <input {...register('nome')} className="pf-input" placeholder="Ex: Vestido Midi..." />
          </div>

          <div className="pf-grid">
            <div className="pf-field-group">
              <label className="pf-label">Categoria</label>
              <div className="pf-chips">
                {CATEGORIES.map(cat => (
                  <button key={cat} type="button" onClick={() => setValue('categoria', cat)} className={`pf-chip ${selectedCat === cat ? 'active' : ''}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="pf-field-group">
              <label className="pf-label">Preço de Venda</label>
              <input 
                {...register('preco')} 
                className="pf-input" 
                style={{ color: '#c92a66' }}
                placeholder="R$ 0,00"
                onChange={(e) => setValue('preco', e.target.value.replace(/\D/g, '').replace(/(\d+)(\d{2})$/, 'R$ $1,$2'), { shouldValidate: true })}
              />
            </div>
          </div>

          <div className="pf-field-group">
            <label className="pf-label">Tamanhos Disponíveis</label>
            <div className="pf-chips">
              {AVAILABLE_SIZES.map(size => (
                <button key={size} type="button" onClick={() => toggleSize(size)} className={`pf-chip ${selectedSizes.includes(size) ? 'active' : ''}`}>
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="pf-field-group">
            <label className="pf-label">Descrição e Detalhes</label>
            <textarea {...register('descricao')} className="pf-input" style={{ minHeight: '100px', fontSize: '16px' }} placeholder="Descreva o caimento, tecido..." />
          </div>

          <button type="submit" className="pf-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Finalizar Cadastro'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
