(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const t of document.querySelectorAll('link[rel="modulepreload"]'))i(t);new MutationObserver(t=>{for(const a of t)if(a.type==="childList")for(const s of a.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&i(s)}).observe(document,{childList:!0,subtree:!0});function o(t){const a={};return t.integrity&&(a.integrity=t.integrity),t.referrerPolicy&&(a.referrerPolicy=t.referrerPolicy),t.crossOrigin==="use-credentials"?a.credentials="include":t.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function i(t){if(t.ep)return;t.ep=!0;const a=o(t);fetch(t.href,a)}})();const u="5546999161642",m=`https://wa.me/${u}`,b=[{id:"conjunto-floral",category:"conjuntos",image:"/images/piece-conjunto1.jpg",name:"Conjunto Floral Premium",price:"R$ 179,90",description:"Conjunto leve com estampa floral e acabamento elegante. Ideal para trabalho e eventos sociais.",sizes:["P","M","G"]},{id:"blusa-rosa",category:"blusas",image:"/images/piece-blusa.jpg",name:"Blusa Feminina Rosa",price:"R$ 89,90",description:"Blusa moderna em tecido leve, com detalhe em mangas amplas e caimento sofisticado.",sizes:["P","M","G"]},{id:"camisa-branca",category:"camisas",image:"/images/piece-camisa.jpg",name:"Camisa Branca Casual",price:"R$ 109,90",description:"Camisa clássica com modelagem solta, perfeita para looks chiques e confortáveis.",sizes:["P","M"]},{id:"calca-marrom",category:"calcas",image:"/images/piece-calca.jpg",name:"Calça Marrom Alfaiataria",price:"R$ 129,90",description:"Calça de alfaiataria com corte reto, ótima para combinar com blusas e jaquetas.",sizes:["P","M","G"]},{id:"bermuda-casual",category:"calcas",image:"/images/piece-bermuda.jpg",name:"Bermuda Casual Marrom",price:"R$ 99,90",description:"Bermuda confortável com elastano, perfeita para produções modernas do dia a dia.",sizes:["M"]},{id:"conjunto-terra",category:"conjuntos",image:"/images/piece-conjunto2.jpg",name:"Conjunto Terra",price:"R$ 189,90",description:"Conjunto em tons terrosos, ideal para várias ocasiões com muito estilo e conforto.",sizes:["P","M"]}];let c=JSON.parse(localStorage.getItem("luzDaModaProducts"))||b;window.location.search.includes("admin")?localStorage.getItem("adminLoggedIn")==="true"?l():p():h();function h(){const r=c.map(a=>`
    <article class="product" data-category="${a.category}">
      <img src="${a.image}" alt="${a.name}" />
      <div class="product-body">
        <h3>${a.name}</h3>
        <p class="price">${a.price}</p>
        <p class="product-desc">${a.description}</p>
        <p class="sizes"><strong>Tamanhos:</strong> ${a.sizes.join(", ")}</p>
      </div>
    </article>
  `).join(""),e=document.querySelector("#app");e.innerHTML=`
    <header class="hero">
      <div class="hero-content">
        <span class="eyebrow">Luz da Moda</span>
        <h1>Moda feminina com estilo e atendimento local</h1>
        <p>Peças selecionadas para você, com entrega condicional em Dois Vizinhos e região.</p>
        <div class="hero-actions">
          <a href="${m}" class="cta-button">Peça pelo WhatsApp</a>
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
        ${r}
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
        <a href="${m}">WhatsApp</a>
      </div>
    </footer>

    <a href="${m}" class="whatsapp-float" aria-label="Ir para WhatsApp">💬</a>
  `;const o=document.querySelectorAll(".filter-btn"),i=document.querySelectorAll(".product");o.forEach(a=>{a.addEventListener("click",()=>{const s=a.dataset.category;o.forEach(n=>n.classList.remove("active")),a.classList.add("active"),i.forEach(n=>{s==="all"||n.dataset.category===s?n.style.display="grid":n.style.display="none"})})});const t=document.getElementById("contact-form");t.addEventListener("submit",a=>{a.preventDefault();const s=new FormData(t),n=s.get("name"),d=s.get("email"),g=s.get("message"),f=`Olá, meu nome é ${n}. Email: ${d}. Mensagem: ${g}`,v=`https://wa.me/${u}?text=${encodeURIComponent(f)}`;window.open(v,"_blank")})}function p(){const r=document.querySelector("#app");r.innerHTML=`
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
  `,document.getElementById("login-form").addEventListener("submit",e=>{e.preventDefault();const o=document.getElementById("username").value,i=document.getElementById("password").value;o==="Admin"&&i==="Admin"?(localStorage.setItem("adminLoggedIn","true"),l()):alert("Usuário ou senha incorretos!")}),document.getElementById("back-to-site").addEventListener("click",()=>{window.location.search=""})}function l(){const r=document.querySelector("#app");r.innerHTML=`
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
        ${c.map((e,o)=>`
          <div class="admin-product" data-index="${o}">
            <div class="admin-product-header">
              <h3>${e.name}</h3>
              <button class="delete-product" data-index="${o}">Excluir</button>
            </div>
            <div class="admin-product-form">
              <label>Nome: <input type="text" value="${e.name}" data-field="name"></label>
              <label>Categoria: 
                <select data-field="category">
                  <option value="blusas" ${e.category==="blusas"?"selected":""}>Blusas</option>
                  <option value="camisas" ${e.category==="camisas"?"selected":""}>Camisas</option>
                  <option value="calcas" ${e.category==="calcas"?"selected":""}>Calças</option>
                  <option value="conjuntos" ${e.category==="conjuntos"?"selected":""}>Conjuntos</option>
                  <option value="vestidos" ${e.category==="vestidos"?"selected":""}>Vestidos</option>
                </select>
              </label>
              <label>Imagem (URL ou caminho): <input type="text" value="${e.image}" data-field="image"></label>
              <label>Preço: <input type="text" value="${e.price}" data-field="price"></label>
              <label>Descrição: <textarea data-field="description">${e.description}</textarea></label>
              <label>Tamanhos (separados por vírgula): <input type="text" value="${e.sizes.join(", ")}" data-field="sizes"></label>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `,document.getElementById("logout").addEventListener("click",()=>{localStorage.removeItem("adminLoggedIn"),p()}),document.getElementById("back-to-site").addEventListener("click",()=>{window.location.search=""}),document.getElementById("add-product").addEventListener("click",()=>{const e={id:Date.now().toString(),category:"blusas",image:"/images/placeholder.jpg",name:"Novo Produto",price:"R$ 0,00",description:"Descrição do produto",sizes:["P","M","G"]};c.push(e),l()}),document.getElementById("save-changes").addEventListener("click",()=>{document.querySelectorAll(".admin-product").forEach((o,i)=>{o.querySelectorAll("[data-field]").forEach(a=>{const s=a.dataset.field;let n=a.value;s==="sizes"&&(n=n.split(",").map(d=>d.trim())),c[i][s]=n})}),localStorage.setItem("luzDaModaProducts",JSON.stringify(c)),alert("Alterações salvas com sucesso!")}),document.getElementById("export-data").addEventListener("click",()=>{const e=JSON.stringify(c,null,2),o="data:application/json;charset=utf-8,"+encodeURIComponent(e),i="luz-da-moda-products.json",t=document.createElement("a");t.setAttribute("href",o),t.setAttribute("download",i),t.click()}),document.getElementById("import-data").addEventListener("click",()=>{const e=document.createElement("input");e.type="file",e.accept=".json",e.onchange=o=>{const i=o.target.files[0],t=new FileReader;t.onload=a=>{try{c=JSON.parse(a.target.result),localStorage.setItem("luzDaModaProducts",JSON.stringify(c)),l(),alert("Dados importados com sucesso!")}catch(s){alert("Erro ao importar dados: "+s.message)}},t.readAsText(i)},e.click()}),document.addEventListener("click",e=>{if(e.target.classList.contains("delete-product")){const o=parseInt(e.target.dataset.index);confirm("Tem certeza que deseja excluir este produto?")&&(c.splice(o,1),l())}})}
