import './style.css'

const whatsappNumber = '5546999161642'
const whatsappLink = `https://wa.me/${whatsappNumber}`

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

// Carregar produtos do localStorage ou usar padrão
let products = JSON.parse(localStorage.getItem('luzDaModaProducts')) || defaultProducts

// Verificar se é modo admin
if (window.location.search.includes('admin')) {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true'
  if (isLoggedIn) {
    renderAdminInterface()
  } else {
    renderLoginInterface()
  }
} else {
  renderLandingPage()
}

function renderLandingPage() {
  const productCards = products.map(product => `
    <article class="product" data-category="${product.category}">
      <img src="${product.image}" alt="${product.name}" />
      <div class="product-body">
        <h3>${product.name}</h3>
        <p class="price">${product.price}</p>
        <p class="product-desc">${product.description}</p>
        <p class="sizes"><strong>Tamanhos:</strong> ${product.sizes.join(', ')}</p>
      </div>
    </article>
  `).join('')

  const app = document.querySelector('#app')
  app.innerHTML = `
    <header class="hero">
      <div class="hero-content">
        <span class="eyebrow">Luz da Moda</span>
        <h1>Moda feminina com estilo e atendimento local</h1>
        <p>Peças selecionadas para você, com entrega condicional em Dois Vizinhos e região.</p>
        <div class="hero-actions">
          <a href="${whatsappLink}" class="cta-button">Peça pelo WhatsApp</a>
          <a href="#catalog" class="secondary-button">Ver catálogo</a>
        </div>
        <p class="hero-note">Entregas condicionais sob consulta. Retirada em loja e atendimento rápido pelo WhatsApp.</p>
      </div>
      <div class="hero-image-wrap">
        <img src="/images/piece-blusa.jpg" alt="Peças femininas da Luz da Moda" class="hero-image" />
      </div>
    </header>

    <section class="location">
      <div>
        <h2>Localização da loja</h2>
        <p>Centro de Dois Vizinhos - PR</p>
        <p>Atendimento presencial e retirada na loja. Agende sua visita pelo WhatsApp.</p>
      </div>
    </section>

    <section id="catalog" class="catalog">
      <div class="catalog-header">
        <h2>Catálogo por peça</h2>
        <p>Escolha sua peça ideal e confira tamanhos, descrição e valores.</p>
      </div>
      <div class="filters">
        <button class="filter-btn active" data-category="all">Todos</button>
        <button class="filter-btn" data-category="vestidos">Vestidos</button>
        <button class="filter-btn" data-category="blusas">Blusas</button>
        <button class="filter-btn" data-category="camisas">Camisas</button>
        <button class="filter-btn" data-category="calcas">Calças</button>
        <button class="filter-btn" data-category="conjuntos">Conjuntos</button>
      </div>
      <div class="products">
        ${productCards}
      </div>
    </section>

    <section class="testimonials">
      <h2>O que nossas clientes falam</h2>
      <div class="testimonial-grid">
        <article class="testimonial-card">
          <p>"Amei a qualidade e o atendimento da Luz da Moda. Entrega rápida e de confiança."</p>
          <cite>- Juliana, Dois Vizinhos</cite>
        </article>
        <article class="testimonial-card">
          <p>"Peças lindas e ótimo caimento. Recomendo para quem busca moda elegante e confortável."</p>
          <cite>- Camila, PR</cite>
        </article>
      </div>
    </section>

    <section class="contact">
      <div class="contact-info-panel">
        <h2>Entre em contato</h2>
        <p>Peça pelo WhatsApp ou preencha o formulário para atendimento personalizado.</p>
        <p><strong>WhatsApp:</strong> 55 46 99916-16-42</p>
        <p><strong>Instagram:</strong> @lusdamodastore</p>
      </div>
      <form id="contact-form" class="contact-form">
        <input type="text" name="name" placeholder="Seu Nome" required>
        <input type="email" name="email" placeholder="Seu Email" required>
        <textarea name="message" placeholder="Sua Mensagem" required></textarea>
        <button type="submit">Enviar mensagem</button>
      </form>
    </section>

    <footer class="footer">
      <div>
        <p>Luz da Moda - Centro, Dois Vizinhos, PR</p>
        <p>Entrega condicional e agendamento via WhatsApp.</p>
      </div>
      <div class="social-links">
        <a href="https://instagram.com/lusdamodastore">Instagram</a>
        <a href="${whatsappLink}">WhatsApp</a>
      </div>
    </footer>

    <a href="${whatsappLink}" class="whatsapp-float" aria-label="Ir para WhatsApp">💬</a>
  `

  const filterButtons = document.querySelectorAll('.filter-btn')
  const productCardsElements = document.querySelectorAll('.product')

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category
      filterButtons.forEach(btn => btn.classList.remove('active'))
      button.classList.add('active')

      productCardsElements.forEach(product => {
        if (category === 'all' || product.dataset.category === category) {
          product.style.display = 'grid'
        } else {
          product.style.display = 'none'
        }
      })
    })
  })

  const contactForm = document.getElementById('contact-form')
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(contactForm)
    const name = formData.get('name')
    const email = formData.get('email')
    const message = formData.get('message')
    const whatsappMessage = `Olá, meu nome é ${name}. Email: ${email}. Mensagem: ${message}`
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`
    window.open(whatsappUrl, '_blank')
  })
}

function renderLoginInterface() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="login-container">
      <div class="login-form">
        <h1>Painel Administrativo</h1>
        <p>Luz da Moda - Acesso Restrito</p>
        <form id="login-form">
          <div class="form-group">
            <label for="username">Usuário:</label>
            <input type="text" id="username" name="username" required>
          </div>
          <div class="form-group">
            <label for="password">Senha:</label>
            <input type="password" id="password" name="password" required>
          </div>
          <button type="submit" class="login-btn">Entrar</button>
        </form>
        <button id="back-to-site" class="back-btn">Voltar ao Site</button>
      </div>
    </div>
  `

  document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault()
    const username = document.getElementById('username').value
    const password = document.getElementById('password').value

    if (username === 'Admin' && password === 'Admin') {
      localStorage.setItem('adminLoggedIn', 'true')
      renderAdminInterface()
    } else {
      alert('Usuário ou senha incorretos!')
    }
  })

  document.getElementById('back-to-site').addEventListener('click', () => {
    window.location.search = ''
  })
}

function renderAdminInterface() {
  const app = document.querySelector('#app')
  app.innerHTML = `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Painel Administrativo - Luz da Moda</h1>
    <div class="admin-header-actions">
      <button id="logout" class="secondary-button">Sair</button>
      <button id="back-to-site" class="secondary-button">Voltar ao Site</button>
    </div>
      <div class="admin-actions">
        <button id="add-product" class="cta-button">Adicionar Novo Produto</button>
        <button id="save-changes" class="cta-button">Salvar Alterações</button>
        <button id="export-data" class="secondary-button">Exportar Dados</button>
        <button id="import-data" class="secondary-button">Importar Dados</button>
      </div>

      <div id="products-list" class="products-list">
        ${products.map((product, index) => `
          <div class="admin-product" data-index="${index}">
            <div class="admin-product-header">
              <h3>${product.name}</h3>
              <button class="delete-product" data-index="${index}">Excluir</button>
            </div>
            <div class="admin-product-form">
              <label>Nome: <input type="text" value="${product.name}" data-field="name"></label>
              <label>Categoria: 
                <select data-field="category">
                  <option value="blusas" ${product.category === 'blusas' ? 'selected' : ''}>Blusas</option>
                  <option value="camisas" ${product.category === 'camisas' ? 'selected' : ''}>Camisas</option>
                  <option value="calcas" ${product.category === 'calcas' ? 'selected' : ''}>Calças</option>
                  <option value="conjuntos" ${product.category === 'conjuntos' ? 'selected' : ''}>Conjuntos</option>
                  <option value="vestidos" ${product.category === 'vestidos' ? 'selected' : ''}>Vestidos</option>
                </select>
              </label>
              <label>Imagem (URL ou caminho): <input type="text" value="${product.image}" data-field="image"></label>
              <label>Preço: <input type="text" value="${product.price}" data-field="price"></label>
              <label>Descrição: <textarea data-field="description">${product.description}</textarea></label>
              <label>Tamanhos (separados por vírgula): <input type="text" value="${product.sizes.join(', ')}" data-field="sizes"></label>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `

  // Event listeners para admin
  document.getElementById('logout').addEventListener('click', () => {
    localStorage.removeItem('adminLoggedIn')
    renderLoginInterface()
  })

  document.getElementById('back-to-site').addEventListener('click', () => {
    window.location.search = ''
  })

  document.getElementById('add-product').addEventListener('click', () => {
    const newProduct = {
      id: Date.now().toString(),
      category: 'blusas',
      image: '/images/placeholder.jpg',
      name: 'Novo Produto',
      price: 'R$ 0,00',
      description: 'Descrição do produto',
      sizes: ['P', 'M', 'G']
    }
    products.push(newProduct)
    renderAdminInterface()
  })

  document.getElementById('save-changes').addEventListener('click', () => {
    const productElements = document.querySelectorAll('.admin-product')
    productElements.forEach((el, index) => {
      const fields = el.querySelectorAll('[data-field]')
      fields.forEach(field => {
        const fieldName = field.dataset.field
        let value = field.value
        if (fieldName === 'sizes') {
          value = value.split(',').map(s => s.trim())
        }
        products[index][fieldName] = value
      })
    })
    localStorage.setItem('luzDaModaProducts', JSON.stringify(products))
    alert('Alterações salvas com sucesso!')
  })

  document.getElementById('export-data').addEventListener('click', () => {
    const dataStr = JSON.stringify(products, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'luz-da-moda-products.json'
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  })

  document.getElementById('import-data').addEventListener('click', () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = event => {
        try {
          const importedProducts = JSON.parse(event.target.result)
          products = importedProducts
          localStorage.setItem('luzDaModaProducts', JSON.stringify(products))
          renderAdminInterface()
          alert('Dados importados com sucesso!')
        } catch (error) {
          alert('Erro ao importar dados: ' + error.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })

  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-product')) {
      const index = parseInt(e.target.dataset.index)
      if (confirm('Tem certeza que deseja excluir este produto?')) {
        products.splice(index, 1)
        renderAdminInterface()
      }
    }
  })
}