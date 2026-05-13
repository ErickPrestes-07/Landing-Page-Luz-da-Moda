import './style.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirebase } from './firebase.js'
import AdminDashboard from './components/AdminDashboard'

const whatsappNumber = '5546999161642'
const whatsappLink = `https://wa.me/${whatsappNumber}`

function getStoredCategories() {
  const stored = localStorage.getItem('luzDaModaCategories');
  if (stored) return JSON.parse(stored);
  return ['vestidos', 'blusas', 'calcas', 'camisas', 'conjuntos'];
}

let dynamicCategories = getStoredCategories();

const defaultProducts = [
  {
    id: 'conjunto-floral',
    category: 'conjuntos',
    image: '/images/piece-conjunto1.jpg',
    name: 'Conjunto Floral Premium',
    price: 'R$ 179,90',
    description: 'Conjunto leve com estampa floral e acabamento elegante. Ideal para trabalho e eventos sociais.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'blusa-rosa',
    category: 'blusas',
    image: '/images/piece-blusa.jpg',
    name: 'Blusa Feminina Rosa',
    price: 'R$ 89,90',
    description: 'Blusa moderna em tecido leve, com detalhe em mangas amplas e caimento sofisticado.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'camisa-branca',
    category: 'camisas',
    image: '/images/piece-camisa.jpg',
    name: 'Camisa Branca Casual',
    price: 'R$ 109,90',
    description: 'Camisa clássica com modelagem solta, perfeita para looks chiques e confortáveis.',
    sizes: ['P', 'M']
  },
  {
    id: 'calca-marrom',
    category: 'calcas',
    image: '/images/piece-calca.jpg',
    name: 'Calça Marrom Alfaiataria',
    price: 'R$ 129,90',
    description: 'Calça de alfaiataria com corte reto, ótima para combinar com blusas e jaquetas.',
    sizes: ['P', 'M', 'G']
  },
  {
    id: 'bermuda-casual',
    category: 'calcas',
    image: '/images/piece-bermuda.jpg',
    name: 'Bermuda Casual Marrom',
    price: 'R$ 99,90',
    description: 'Bermuda confortável com elastano, perfeita para produções modernas do dia a dia.',
    sizes: ['M']
  },
  {
    id: 'conjunto-terra',
    category: 'conjuntos',
    image: '/images/piece-conjunto2.jpg',
    name: 'Conjunto Terra',
    price: 'R$ 189,90',
    description: 'Conjunto em tons terrosos, ideal para várias ocasiões com muito estilo e conforto.',
    sizes: ['P', 'M']
  }
]

function loadStoredProducts() {
  try {
    const raw = localStorage.getItem('luzDaModaProducts')
    if (!raw) return defaultProducts
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : defaultProducts
  } catch {
    return defaultProducts
  }
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
  const appDiv = document.getElementById('app')
  const root = ReactDOM.createRoot(appDiv)

  onAuthStateChanged(fb.auth, (user) => {
    if (user) {
      root.render(
        <React.StrictMode>
          <AdminDashboard />
        </React.StrictMode>
      )
    } else {
      renderLoginInterface()
    }
  })
}

if (window.location.search.includes('admin')) {
  startAdminPanel()
} else {
  renderLandingPage()
}

function renderLandingPage() {
  const renderProductCards = (filteredProducts) => {
    if (filteredProducts.length === 0) {
      return `<div class="no-stock-message">
        <span class="no-stock-icon">🛍️</span>
        <p>No momento não temos peças em estoque para esta categoria.</p>
        <p class="no-stock-sub">Fique de olho! Novidades chegam toda semana.</p>
      </div>`
    }

    return filteredProducts.map(product => `
      <article class="product" data-category="${escapeAttr(product.category)}">
        <div class="product-image-wrap">
          <img src="${escapeAttr(product.image)}" alt="${escapeAttr(product.name)}" class="product-img" />
        </div>
        <div class="product-body">
          <h3 class="product-title">${escapeHtml(product.name)}</h3>
          <span class="product-category-tag">${escapeHtml(product.category)}</span>
          <p class="price">${escapeHtml(product.price)}</p>
          <p class="product-desc">${escapeHtml(product.description)}</p>
          <div class="product-sizes">
            ${(product.sizes || []).map(s => `<span>${s}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('')
  }

  const app = document.querySelector('#app')
  app.innerHTML = `
    <header class="site-header">
      <div class="header-content-wrap">
        <div class="site-brand">
          <img src="/favicon.png" alt="Logo" class="header-logo">
          <span class="site-nav-brand">Luz da Moda</span>
        </div>
        
        <div class="header-actions">
          <button class="menu-toggle" id="menu-btn" aria-label="Menu">
            <div class="bar"></div>
            <div class="bar"></div>
            <div class="bar"></div>
          </button>
          
          <nav class="dropdown-menu" id="dropdown-menu">
            <div class="menu-links">
              <a href="#catalog" class="menu-item close-trigger">Catálogo</a>
              <a href="#contact" class="menu-item close-trigger">Contato</a>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-categories">
              <h4>Filtrar por Categoria</h4>
              <div class="category-links">
                <button class="menu-cat-btn active" data-category="all">Todas as Peças</button>
                ${dynamicCategories.map(cat => `<button class="menu-cat-btn" data-category="${cat}">${cat}</button>`).join('')}
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>

    <main class="catalog" id="catalog">
      <div class="catalog-header">
        <h2 class="catalog-title">Nossas Peças</h2>
        <p>Confira nossa seleção exclusiva</p>
      </div>
      
      <div class="filters" id="desktop-filters">
        <button class="filter-btn active" data-category="all">Todos</button>
        ${dynamicCategories.map(cat => `<button class="filter-btn" data-category="${cat}">${cat}</button>`).join('')}
      </div>

      <div class="products" id="products-grid">
        ${renderProductCards(products)}
      </div>
    </main>

    <footer class="footer" id="contact">
      <div class="footer-info">
        <div class="site-brand">
          <span class="site-nav-brand">Luz da Moda</span>
        </div>
        
        <div class="footer-contact-list">
          <div class="contact-item">
            <span class="icon">📍</span>
            <span class="text">Dois Vizinhos - PR</span>
          </div>
          <div class="contact-item">
            <span class="icon">📱</span>
            <span class="text">(46) 99916-1642</span>
          </div>
          <div class="contact-item">
            <span class="icon">📸</span>
            <a href="https://instagram.com/lusdamodastore" target="_blank" class="text">@lusdamodastore</a>
          </div>
        </div>

        <div class="footer-actions">
          <a href="${whatsappLink}" target="_blank" class="social-button-outline">
            Chamar no WhatsApp
          </a>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>© 2026 Luz da Moda | <a href="?admin" class="admin-link">Admin</a></p>
      </div>
    </footer>
  `

  const menuBtn = document.getElementById('menu-btn');
  const dropdownMenu = document.getElementById('dropdown-menu');
  const productsGrid = document.getElementById('products-grid');

  const toggleMenu = () => {
    dropdownMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
  }

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  document.addEventListener('click', (e) => {
    if (!dropdownMenu.contains(e.target) && !menuBtn.contains(e.target)) {
      dropdownMenu.classList.remove('active');
      menuBtn.classList.remove('active');
    }
  });

  document.querySelectorAll('.close-trigger').forEach(link => {
    link.addEventListener('click', () => {
      dropdownMenu.classList.remove('active');
      menuBtn.classList.remove('active');
    });
  });

  const applyFilter = (category) => {
    const filtered = category === 'all' ? products : products.filter(p => p.category === category);
    productsGrid.innerHTML = renderProductCards(filtered);
    
    document.querySelectorAll('.filter-btn, .menu-cat-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === category);
    });
  }

  document.querySelectorAll('.filter-btn, .menu-cat-btn').forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.category));
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
