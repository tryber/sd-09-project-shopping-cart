function createProductImageElement(imageSource) {
  // funcao que gera thumbnail do produto
  const img = document.createElement('img');
  // cria elemento 'img' no DOM
  img.className = 'item__image';
  // acrescenta a clasee 'item__image' a img criada
  img.src = imageSource;
  // define src da tag img como parametro da funcao
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  // funcao de listagem de produtos
  const section = document.createElement('section');
  // cria elemento 'section' no DOM
  section.className = 'item';
  // acrescenta a classe 'item' a section criada

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  // agrega ao elemento section, elemento 'span' com os valores da chave sku
  section.appendChild(createCustomElement('span', 'item__title', name));
  // agrega ao elemento section, elemento 'span' com os valores da chave name
  section.appendChild(createProductImageElement(image));
  // agrega ao elemento section, elemento 'img' com os valores da chave image
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  // agrega ao elemento section, um botao para adicionar item ao carrinho
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function sumValue() {
  let sum = 0;
  const totalValue = document.querySelector('.total-value');
  const cartItems = document.querySelectorAll('li');
  [...cartItems].forEach((element) => {
    // carrega os elementos do cartItems num array
    // e para cada elemento
    sum += parseFloat(element.innerHTML.split('$')[1]);
    // converte a string em numero e soma esses valores
  });
  totalValue.innerHTML = sum;
  // o elemento indicado pelo totalValue e carregado
  // com o valor do acumulador da soma
}

function saveCart() {
  // salva lista do carrinho
  const cartList = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-value');
  localStorage.setItem('cart', cartList.innerHTML);
  // salva conteudo dos elementos da lista
  localStorage.setItem('value', totalValue.innerHTML);
}

function cartItemClickListener(event) {
  event.target.remove();
  // remove elemento target do click
  sumValue();
  saveCart();
}

function loadCart() {
  const cartList = document.querySelector('.cart__items');
  cartList.innerHTML = localStorage.getItem('cart');
  // carrega lista com conteudo do localStorage
  const cartItems = document.querySelectorAll('li');
  cartItems.forEach(item => item.addEventListener('click', cartItemClickListener));
  // torna os itens da lista recarregada clicaveis
  sumValue();
}

function createCartItemElement({ sku, name, salePrice }) {
  // cria elemento no carrinho de compras
  const li = document.createElement('li');
  // cria elemento li no DOM
  li.className = 'cart__item';
  // acrescenta a classe 'cart__item' a li criada
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  // carrega elemento criado com informacoes do objeto 'product'
  li.addEventListener('click', cartItemClickListener);
  // torna o elemento criado clicavel
  // dispara funcao cartItemClickListener
  return li;
}

function emptyCart() {
  // esvazia o carrinho
  const emptyCartBtn = document.querySelector('.empty-cart');
  const cartList = document.querySelector('.cart__items');
  const totalValue = document.querySelector('.total-value');
  emptyCartBtn.addEventListener('click', () => {
    // torna o botao clicavel
    cartList.innerHTML = '';
    // limpa a lista do carrinho
    localStorage.clear();
    // limpa tudo o que esta armazenado no localStorage
    totalValue.innerHTML = 0;
    // reseta valor da soma total
  });
}

function loadingAlert() {
  const loading = document.createElement('p');
  // cria elemento
  loading.className = 'loading';
  // adiciona classe
  loading.innerHTML = 'loading...';
  // carrega texto do elemento
  document.body.appendChild(loading);
  // fixa elemento criado ao body do HTML
}

function removeLoadingAlert() {
  const loading = document.querySelector('.loading');
  document.body.removeChild(loading);
  // remove elemento
}

async function fetchAPIML(QUERY) {
  // funcao assincrona
  // de requisicao a API e listagem de produtos encontrados
  // (async - retorna uma PROMISE)
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  // determina o endpoint de acesso atraves do parametro da funcao
  loadingAlert();
  // dispara alerta de carregamento
  const response = await fetch(endpoint);
  // 'response' espera receber o resultado da requisicao
  const object = await response.json();
  // converte resultado da requisicao em formato JSON
  const results = object.results;
  // 'results' recebe, os valores da chave "results" do JSON retornado pela requisicao a API
  // na forma de array de objetos
  const itemsElement = document.querySelector('.items');
  // vasculha o DOM por tag com classe 'items'

  results.forEach((result) => {
    // estrutura de repeticao que passa executa acoes com cada valor do array 'results'
    const { id: sku, title: name, thumbnail: image } = result;
    // estrutura objeto
    const element = createProductItemElement({ sku, name, image });
    // chama funcoa de listagem de produtos
    // tendo como parametros os valores dos objetos da array results
    itemsElement.appendChild(element);
    // cria elemento filho, do elemento com classe 'items'
    // com os valores de cada elemento do array 'results'
  });
  removeLoadingAlert();
  // remove alerta de carregamento
  sumValue();
}

async function fetchID(sku) {
  // requisicao feita a partir do valor da chave id do produto
  loadingAlert();
  // dispara alerta de carregamento
  await fetch(`https://api.mercadolibre.com/items/${sku}`)
    .then(response => response.json())
    // converte resultado da requisicao em formato JSON
    .then((data) => {
      const dataProduct = {
        sku,
        name: data.title,
        salePrice: data.price,
      };
      // estrutura objeto
      const list = document.querySelector('.cart__items');
      // vasculha DOM por tag com classe 'cart__items'
      list.appendChild(createCartItemElement(dataProduct));
      // cria elemento filho do elemento com classe 'cart__items'
      // com os valores do objeto 'product'
      // passado como parametro
    });
  removeLoadingAlert();
  // remove alerta de carregamento
  sumValue();
  saveCart();
}

function getId() {
  // busca id (sku) do produto
  const sectionItems = document.querySelector('.items');
  // vasculha o DOM por tag com classe 'items'
  sectionItems.addEventListener('click', (event) => {
    // torna elemento clicavel
    // click no item devolve seu id (sku)
    const item = event.target.parentNode;
    // 'item' recebe elemento pai do produto clicado
    const sku = item.querySelector('span.item__sku').innerText;
    // 'sku' valor do elemento span com classe item__sku
    // na forma de string
    fetchID(sku);
    // roda requisicao com id encontrado
  });
}

window.onload = function onload() {
  fetchAPIML('computador');
  // chama funcao de requisicao a API com parametro 'computador'
  // lista produtos encontrados
  // ao carregar a pagina
  getId();
  // torna os produtos clicaveis
  // seus ids acessiveis
  loadCart();
  // recarrega carrinho ao recarregar pagina
  emptyCart();
};
