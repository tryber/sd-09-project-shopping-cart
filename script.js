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

function cartItemClickListener(event) {
  // START
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

async function fetchAPIML(QUERY) {
  // funcao assincrona
  // de requisicao a API e listagem de produtos encontrados
  // (async - retorna uma PROMISE)
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`;
  // determina o endpoint de acesso atraves do parametro da funcao
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
    const { id: sku, title: name, thumbnail: image } = result; // estrutura objeto
    const element = createProductItemElement({ sku, name, image });
    // chama funcoa de listagem de produtos
    // tendo como parametros os valores dos objetos da array results
    itemsElement.appendChild(element);
    // cria elemento filho, do elemento com classe 'items'
    // com os valores de cada elemento do array 'results'
  });
}

const fetchID = (ItemID) => {
  // requisicao feita a partir do valor da chave id do produto
  fetch(`https://api.mercadolibre.com/items/${ItemID}`)
    .then(response => response.json())
    // converte resultado da requisicao em formato JSON
    .then((data) => {
      const dataProduct = {
        ItemID,
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
};

const getId = () => {
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
};

window.onload = function onload() {
  fetchAPIML('computador');
  // chama funcao de requisicao a API com parametro 'computador'
  // lista produtos encontrados
  // ao carregar a pagina
  getId();
  // torna os produtos clicaveis
  // seus ids acessiveis
};
