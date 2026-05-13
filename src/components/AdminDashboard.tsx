import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  Package, 
  Tag, 
  Maximize, 
  LogOut,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import './AdminDashboard.css';

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  description: string;
  sizes: string[];
  image: string;
}

const AdminDashboard: React.FC = () => {
  // --- States ---
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  
  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'product' | 'category' | 'sizes'>('menu');
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  // Form States
  const [newCat, setNewCat] = useState('');
  const [newSize, setNewSize] = useState('');

  // --- Load Data ---
  useEffect(() => {
    const storedProducts = localStorage.getItem('luzDaModaProducts');
    if (storedProducts) setProducts(JSON.parse(storedProducts));

    const storedCats = localStorage.getItem('luzDaModaCategories');
    if (storedCats) {
      setCategories(JSON.parse(storedCats));
    } else {
      const defaultCats = ['vestidos', 'blusas', 'calcas', 'camisas', 'conjuntos'];
      setCategories(defaultCats);
      localStorage.setItem('luzDaModaCategories', JSON.stringify(defaultCats));
    }

    const storedSizes = localStorage.getItem('luzDaModaSizes');
    if (storedSizes) {
      setAvailableSizes(JSON.parse(storedSizes));
    } else {
      const defaultSizes = ['P', 'M', 'G', 'GG', 'G1', 'G2', 'G3', 'G4'];
      setAvailableSizes(defaultSizes);
      localStorage.setItem('luzDaModaSizes', JSON.stringify(defaultSizes));
    }
  }, []);

  // --- Actions ---
  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('luzDaModaProducts', JSON.stringify(newProducts));
  };

  const handleDelete = (id: string) => {
    const filtered = products.filter(p => p.id !== id);
    saveProducts(filtered);
    toast.success('Produto excluído com sucesso');
    setShowDeleteConfirm(null);
  };

  const handleAddCategory = () => {
    if (!newCat.trim()) return;
    if (categories.includes(newCat.trim().toLowerCase())) {
      toast.error('Esta categoria já existe');
      return;
    }
    const updated = [...categories, newCat.trim().toLowerCase()];
    setCategories(updated);
    localStorage.setItem('luzDaModaCategories', JSON.stringify(updated));
    setNewCat('');
    toast.success('Categoria adicionada!');
  };

  const handleAddSize = () => {
    if (!newSize.trim()) return;
    if (availableSizes.includes(newSize.trim().toUpperCase())) {
      toast.error('Este tamanho já existe');
      return;
    }
    const updated = [...availableSizes, newSize.trim().toUpperCase()];
    setAvailableSizes(updated);
    localStorage.setItem('luzDaModaSizes', JSON.stringify(updated));
    setNewSize('');
    toast.success('Tamanho adicionado!');
  };

  const removeSize = (size: string) => {
    const updated = availableSizes.filter(s => s !== size);
    setAvailableSizes(updated);
    localStorage.setItem('luzDaModaSizes', JSON.stringify(updated));
  };

  // --- Render Helpers ---
  const closeModal = () => {
    setIsMainModalOpen(false);
    setActiveTab('menu');
    setEditingProduct(null);
  };

  return (
    <div className="admin-dashboard">
      <Toaster position="top-right" richColors />
      
      <header className="admin-top-nav">
        <div className="admin-logo">
          <h1>Luz da Moda <span>Admin</span></h1>
        </div>
        <div className="admin-nav-actions">
          <button onClick={() => window.location.href = '/'} className="btn-back-store">
            <LogOut size={18} /> Voltar para Loja
          </button>
        </div>
      </header>

      <main className="admin-content">
        <div className="content-header">
          <h2>Gerenciamento de Produtos</h2>
          <p>{products.length} peças cadastradas no momento</p>
        </div>

        <div className="admin-grid">
          {products.map(product => (
            <div key={product.id} className="admin-card">
              <div className="card-image">
                <img src={product.image} alt={product.name} />
                <div className="card-badge">{product.category}</div>
                
                {/* Menu de 3 Pontinhos */}
                <div className="card-menu-wrap">
                  <button 
                    className="btn-menu-trigger" 
                    onClick={() => setOpenMenuId(openMenuId === product.id ? null : product.id)}
                  >
                    <MoreVertical size={20} />
                  </button>
                  
                  {openMenuId === product.id && (
                    <div className="card-dropdown">
                      <button onClick={() => {
                        setEditingProduct(product);
                        setActiveTab('product');
                        setIsMainModalOpen(true);
                        setOpenMenuId(null);
                      }}>
                        <Edit2 size={14} /> Editar
                      </button>
                      <button className="delete" onClick={() => {
                        setShowDeleteConfirm(product.id);
                        setOpenMenuId(null);
                      }}>
                        <Trash2 size={14} /> Excluir
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-info">
                <h3>{product.name}</h3>
                <div className="card-price">{product.price}</div>
                <div className="card-sizes">
                  {product.sizes.map(s => <span key={s}>{s}</span>)}
                </div>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="empty-state">
              <Package size={48} />
              <p>Nenhum produto cadastrado.</p>
              <button onClick={() => { setActiveTab('product'); setIsMainModalOpen(true); }} className="btn-primary">
                Cadastrar Primeira Peça
              </button>
            </div>
          )}
        </div>
      </main>

      {/* FAB - Floating Action Button */}
      <button className="admin-fab" onClick={() => setIsMainModalOpen(true)} title="Menu de Gerenciamento">
        <Plus size={32} />
      </button>

      {/* --- Modais --- */}
      {isMainModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><X /></button>
            
            {activeTab === 'menu' && (
              <div className="management-menu">
                <h2 className="modal-title">Gerenciamento</h2>
                <div className="menu-options">
                  <button onClick={() => setActiveTab('product')}>
                    <div className="option-icon"><Package /></div>
                    <div className="option-text">
                      <strong>Cadastrar Novo Produto</strong>
                      <span>Adicionar nova peça ao catálogo</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>

                  <button onClick={() => setActiveTab('category')}>
                    <div className="option-icon"><Tag /></div>
                    <div className="option-text">
                      <strong>Cadastrar Nova Categoria</strong>
                      <span>Criar tipos de roupas (ex: Saias, Acessórios)</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>

                  <button onClick={() => setActiveTab('sizes')}>
                    <div className="option-icon"><Maximize /></div>
                    <div className="option-text">
                      <strong>Gerenciar Tamanhos</strong>
                      <span>Configurar tamanhos padrão (P, M, G, Único)</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>

                  <button onClick={() => window.location.href = '/'}>
                    <div className="option-icon"><LogOut /></div>
                    <div className="option-text">
                      <strong>Voltar para o Site</strong>
                      <span>Visualizar loja como cliente</span>
                    </div>
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'product' && (
              <ProductFormScreen 
                initialData={editingProduct} 
                categories={categories} 
                availableSizes={availableSizes}
                onCancel={closeModal}
                onSave={(newProd) => {
                  if (editingProduct) {
                    saveProducts(products.map(p => p.id === newProd.id ? newProd : p));
                    toast.success('Produto atualizado!');
                  } else {
                    saveProducts([...products, newProd]);
                    toast.success('Produto cadastrado!');
                  }
                  closeModal();
                }}
              />
            )}

            {activeTab === 'category' && (
              <div className="tab-screen">
                <h2 className="modal-title">Categorias</h2>
                <div className="form-mini">
                  <input 
                    value={newCat} 
                    onChange={e => setNewCat(e.target.value)} 
                    placeholder="Nome da nova categoria..." 
                  />
                  <button onClick={handleAddCategory} className="btn-add">Adicionar</button>
                </div>
                <div className="item-list">
                  {categories.map(cat => (
                    <div key={cat} className="list-item">
                      <span>{cat}</span>
                      <Check size={16} color="#25d366" />
                    </div>
                  ))}
                </div>
                <button className="btn-text-back" onClick={() => setActiveTab('menu')}>Voltar ao Menu</button>
              </div>
            )}

            {activeTab === 'sizes' && (
              <div className="tab-screen">
                <h2 className="modal-title">Tamanhos Disponíveis</h2>
                <div className="form-mini">
                  <input 
                    value={newSize} 
                    onChange={e => setNewSize(e.target.value)} 
                    placeholder="Ex: GG, 42, Único..." 
                  />
                  <button onClick={handleAddSize} className="btn-add">Adicionar</button>
                </div>
                <div className="item-list">
                  {availableSizes.map(size => (
                    <div key={size} className="list-item">
                      <span>{size}</span>
                      <button className="btn-remove" onClick={() => removeSize(size)}>
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button className="btn-text-back" onClick={() => setActiveTab('menu')}>Voltar ao Menu</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirmação de Exclusão */}
      {showDeleteConfirm && (
        <div className="modal-overlay delete-confirm" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal-content mini" onClick={e => e.stopPropagation()}>
            <AlertCircle size={48} color="#e53e3e" style={{ marginBottom: '20px' }} />
            <h3>Confirmar Exclusão?</h3>
            <p>Esta ação não pode ser desfeita. O produto será removido permanentemente.</p>
            <div className="confirm-actions">
              <button className="btn-cancel" onClick={() => setShowDeleteConfirm(null)}>Cancelar</button>
              <button className="btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>Sim, Excluir</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Sub-Componente de Formulário Interno ---
const ProductFormScreen: React.FC<{ 
  initialData: Product | null, 
  categories: string[], 
  availableSizes: string[],
  onSave: (p: Product) => void,
  onCancel: () => void
}> = ({ initialData, categories, availableSizes, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Product>(initialData || {
    id: Date.now().toString(),
    name: '',
    category: categories[0] || '',
    price: 'R$ 0,00',
    description: '',
    sizes: [],
    image: '/images/piece-blusa.jpg'
  });
  const [preview, setPreview] = useState<string | null>(initialData?.image || null);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        setFormData(prev => ({ ...prev, image: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSize = (size: string) => {
    const current = [...formData.sizes];
    const index = current.indexOf(size);
    if (index > -1) current.splice(index, 1);
    else current.push(size);
    setFormData({ ...formData, sizes: current });
  };

  return (
    <div className="product-form-screen">
      <h2 className="modal-title">{initialData ? 'Editar Produto' : 'Novo Produto'}</h2>
      <div className="pfs-layout">
        <div className="pfs-image-side">
          <label>Foto da Peça</label>
          <div className="pfs-dropzone">
            <input type="file" onChange={handleImage} accept="image/*" />
            {preview ? <img src={preview} /> : <div className="placeholder"><Plus size={32} /><p>Adicionar Foto</p></div>}
          </div>
        </div>
        <div className="pfs-data-side">
          <div className="input-group">
            <label>Nome da Peça</label>
            <input 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
              placeholder="Ex: Vestido Floral Midi"
            />
          </div>
          <div className="input-grid">
            <div className="input-group">
              <label>Preço</label>
              <input 
                value={formData.price} 
                onChange={e => setFormData({...formData, price: e.target.value.replace(/\D/g, '').replace(/(\d+)(\d{2})$/, 'R$ $1,$2')})}
                placeholder="R$ 0,00"
              />
            </div>
            <div className="input-group">
              <label>Categoria</label>
              <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="input-group">
            <label>Tamanhos</label>
            <div className="pfs-chips">
              {availableSizes.map(s => (
                <button 
                  key={s} 
                  type="button" 
                  className={formData.sizes.includes(s) ? 'active' : ''}
                  onClick={() => toggleSize(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="input-group">
            <label>Descrição</label>
            <textarea 
              value={formData.description} 
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Detalhes sobre o tecido, caimento..."
            />
          </div>
        </div>
      </div>
      <div className="pfs-footer">
        <button className="btn-cancel" onClick={onCancel}>Cancelar</button>
        <button className="btn-submit" onClick={() => onSave(formData)}>
          {initialData ? 'Salvar Alterações' : 'Cadastrar Peça'}
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;
