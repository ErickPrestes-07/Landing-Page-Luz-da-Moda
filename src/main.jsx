import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirebase } from './firebase.js'
import ProductForm from './components/ProductForm'

const whatsappNumber = '5546999161642'
const whatsappLink = `https://wa.me/${whatsappNumber}`

const CATEGORIES = ['vestidos', 'blusas', 'calcas', 'camisas', 'conjuntos'];

function loadStoredProducts() {
  const raw = localStorage.getItem('luzDaModaProducts')
  if (!raw) return []
  return JSON.parse(raw)
}

let products = loadStoredProducts()

function escapeHtml(text) {
  return String(text ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function escapeAttr(text) {
  return String(text ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
}

async function startAdminPanel() {
  const fb = getFirebase()
  if (!fb) return
  onAuthStateChanged(fb.auth, (user) => {
    if (!user) {
      renderLoginInterface()
    } else {
      renderAdminInterface()
    }
  })
}

if (window.location.search.includes('admin')) {
  startAdminPanel()
} else {
  renderLandingPage()
}

function renderLandingPage() {
  const productCards = products.map(product => `
    <article class="product" data-category="${escapeAttr(product.category)}">
      <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" />
      <div class="product-body">
        <h3 style="font-weight: 900; margin-bottom: 5px;">${escapeHtml(product.name)}</h3>
        <span style="font-size: 10px; font-weight: 800; color: #bbb; text-transform: uppercase; letter-spacing: 1px;">${escapeHtml(product.category)}</span>
        <p class="price" style="color: #c92a66; font-weight: 800; font-size: 1.2rem; margin: 15px 0;">${escapeHtml(product.price)}</p>
        <p style="color: #777; font-size: 0.85rem; line-height: 1.6; margin-bottom: 25px; min-height: 50px;">${escapeHtml(product.description)}</p>
        <a href="${whatsappLink}" class="cta-button" style="width: 100%; text-align: center; padding: 15px; box-sizing: border-box; font-size: 13px;">Chamar no WhatsApp</a>
      </div>
    </article>
  `).join('')

  const app = document.querySelector('#app')
  app.innerHTML = `
    <header class="site-header">
      <a href="/" class="site-logo">
        <img src="/favicon.png" alt="Luz da Moda" style="height: 35px;">
        Luz da Moda
      </a>
      <nav class="site-nav">
        <a href="#catalog">Catálogo</a>
        <a href="#about">A Loja</a>
        <a href="#contact">Contato</a>
      </nav>
    </header>

    <section class="hero" id="about">
      <div class="hero-content">
        <h1>Sua melhor versão começa aqui.</h1>
        <p>A Luz da Moda nasceu para celebrar a força e a beleza da mulher. Nossa curadoria traz peças selecionadas para o seu dia a dia.</p>
        <a href="#catalog" class="cta-button">Explorar Coleção</a>
      </div>
    </section>

    <main class="catalog" id="catalog">
      <h2 class="catalog-title">Nossas Peças</h2>
      
      <div class="filter-container">
        <button class="filter-btn active" data-category="all">Todos</button>
        ${CATEGORIES.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('')}
      </div>

      <div class="products">
        ${productCards}
      </div>
    </main>

    <footer class="site-footer" id="contact">
      <div class="footer-content">
        <div class="footer-brand">
          <h2 style="display: flex; align-items: center; gap: 10px;">
            <img src="/favicon.png" alt="Luz da Moda" style="height: 30px; filter: brightness(0) invert(1);">
            Luz da Moda
          </h2>
          <p style="opacity: 0.6; font-size: 14px;">Elegância acessível no centro de Dois Vizinhos.</p>
        </div>
        <div class="footer-info">
          <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 15px;">Contato</h3>
          <p>📍 Dois Vizinhos - PR</p>
          <p>📱 (46) 99916-1642</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>© 2026 Luz da Moda Store. Todos os direitos reservados. | <a href="?admin" style="color: inherit; opacity: 0.5; text-decoration: none;">Admin</a></p>
      </div>
    </footer>
  `

  // Lógica de Filtragem
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.category;
      
      // Atualiza botões ativos
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filtra produtos
      document.querySelectorAll('.product').forEach(product => {
        const prodCat = product.dataset.category;
        if (category === 'all' || prodCat === category) {
          product.style.display = 'block';
        } else {
          product.style.display = 'none';
        }
      });
    });
  });
}

function renderLoginInterface() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="login-container">
      <div class="login-form">
        <h1>Acesso Administrativo</h1>
        <form id="auth-form">
          <input type="email" id="auth-email" placeholder="E-mail" required>
          <input type="password" id="auth-password" placeholder="Senha" required>
          <button type="submit" class="login-btn">Entrar</button>
        </form>
        <button id="back-to-site" style="margin-top: 20px; background: none; border: none; color: #999; cursor: pointer; font-weight: bold;">Voltar</button>
      </div>
    </div>
  `
  document.getElementById('auth-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    try {
      await signInWithEmailAndPassword(getFirebase().auth, document.getElementById('auth-email').value, document.getElementById('auth-password').value)
    } catch {
      alert('Acesso negado.')
    }
  })
  document.getElementById('back-to-site').addEventListener('click', () => window.location.search = '')
}

let isFormOpen = false;

function renderAdminInterface() {
  const app = document.querySelector('#app')
  
  function updateUI() {
    const productRows = products.map((product, index) => `
      <div class="admin-product-card">
        <div style="position: relative; margin-bottom: 25px;">
          <img src="${product.image}" class="admin-product-image" id="prev-${index}">
          <div style="position: absolute; bottom: 10px; right: 10px; background: white; padding: 8px; border-radius: 12px; font-size: 10px; font-weight: 800; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            TROCAR FOTO
            <input type="file" class="img-input" data-index="${index}" style="position: absolute; inset: 0; opacity: 0; cursor: pointer;">
          </div>
        </div>
        
        <div class="admin-input-group">
          <label class="admin-label">Nome</label>
          <input type="text" class="admin-input" value="${escapeAttr(product.name)}" data-index="${index}" data-field="name">
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div class="admin-input-group">
            <label class="admin-label">Preço</label>
            <input type="text" class="admin-input" value="${escapeAttr(product.price)}" data-index="${index}" data-field="price">
          </div>
          <div class="admin-input-group">
            <label class="admin-label">Categoria</label>
            <select class="admin-input admin-select" data-index="${index}" data-field="category">
              ${CATEGORIES.map(cat => `<option value="${cat}" ${product.category === cat ? 'selected' : ''}>${cat}</option>`).join('')}
            </select>
          </div>
        </div>

        <div class="admin-input-group">
          <label class="admin-label">Descrição</label>
          <textarea class="admin-input admin-textarea" data-index="${index}" data-field="description">${escapeHtml(product.description)}</textarea>
        </div>

        <div class="admin-card-actions">
          <button class="btn-delete" data-index="${index}">Excluir</button>
        </div>
      </div>
    `).join('')

    app.innerHTML = `
      <div class="admin-container">
        <header class="admin-header">
          <div style="display: flex; align-items: center; gap: 15px;">
            <img src="/favicon.png" alt="Logo" style="height: 40px;">
            <h1 style="font-size: 20px; font-weight: 900; margin: 0; color: #333;">Gestão Luz da Moda</h1>
          </div>
          <div style="display: flex; gap: 20px;">
            <button id="back-to-site" style="background: none; border: none; font-weight: 700; cursor: pointer; color: #999; font-size: 14px;">SITE</button>
            <button id="logout" style="background: none; border: none; font-weight: 700; cursor: pointer; color: #c92a66; font-size: 14px;">SAIR</button>
          </div>
        </header>

        <div style="text-align: center; margin-bottom: 80px;">
          <button id="toggle-form" class="cta-button" style="padding: 25px 60px; font-size: 1.1rem;">
            ${isFormOpen ? '✕ Fechar Cadastro' : '+ Cadastrar Nova Peça'}
          </button>
        </div>

        <div id="form-container" ${!isFormOpen ? 'hidden' : ''} style="margin-bottom: 80px;">
          <div id="react-product-form"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
          <h2 style="font-size: 24px; font-weight: 900;">Catálogo Ativo (${products.length})</h2>
          <button id="save-all" class="cta-button" style="padding: 15px 30px; font-size: 0.8rem; border-radius: 15px;">Salvar Alterações</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px;">
          ${productRows}
        </div>
      </div>
    `

    document.getElementById('toggle-form').addEventListener('click', () => {
      isFormOpen = !isFormOpen
      updateUI()
    })

    if (isFormOpen) {
      ReactDOM.createRoot(document.getElementById('react-product-form')).render(<ProductForm onSuccess={() => {
        products = loadStoredProducts()
        isFormOpen = false
        updateUI()
      }} />)
    }

    document.getElementById('logout').addEventListener('click', () => signOut(getFirebase().auth))
    document.getElementById('back-to-site').addEventListener('click', () => window.location.search = '')

    document.getElementById('save-all').addEventListener('click', () => {
      const cards = document.querySelectorAll('.admin-product-card');
      cards.forEach((card, idx) => {
        const inputs = card.querySelectorAll('[data-field]');
        inputs.forEach(input => {
          const field = input.dataset.field;
          products[idx][field] = input.value;
        });
      });
      localStorage.setItem('luzDaModaProducts', JSON.stringify(products));
      alert('Alterações salvas!');
      updateUI();
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => {
        if(confirm('Excluir peça?')) {
          products.splice(btn.dataset.index, 1);
          localStorage.setItem('luzDaModaProducts', JSON.stringify(products));
          updateUI();
        }
      });
    });

    document.querySelectorAll('.img-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if(file) {
          const reader = new FileReader();
          reader.onload = (ev) => {
            const idx = input.dataset.index;
            products[idx].image = ev.target.result;
            document.getElementById(`prev-${idx}`).src = ev.target.result;
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  updateUI()
}
