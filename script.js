window.onload = function onload() {
  fetchProducts('computador'); // chama funcao de requisicao a API com parametro 'computador', ao carregar a pagina
};

async function fetchAPIML(QUERY) { // funcao assincrona de requisicao a API e listagem de produtos encontrados (async - retorna uma PROMISE)
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${QUERY}`; // determina o endpoint de acesso atraves do parametro da funcao
  const response = await fetch(endpoint); // 'response' espera receber o resultado da requisicao
  const object = response.json(); // converte resultado da requisicao em formato JSON
  const results = object.results; // 'results' recebe, na forma de array de objetos, os valores da chave "results" do JSON retornado pela requisicao a API
  const itemsElement = document.querySelector('.items'); // vasculha o DOM por tag com classe 'items'
  results.forEach((result) => { // estrutura de repeticao que passa por cada cada valor do array 'results'
    const { id: sku, title: name, thumbnail: image } = result; // estrutura objeto
    const element = createProductItemElement({ sku, name, image }); // chama funcoa de listagem de produtos, tendo com parametros os valores dos objetos da array results
    itemsElement.appendChild(element); // cria um elemento filho, do elemento com classe 'items', com os valores de cada elemento do array 'results'
  });
}

function createProductImageElement(imageSource) { // funcao que gera thumbnail do produto
  const img = document.createElement('img'); // cria elemento 'img' no DOM
  img.className = 'item__image'; // acrescenta a clasee 'item__image' a img criada
  img.src = imageSource; // define src da tag img como parametro da funcao
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) { // funcao de listagem de produtos
  const section = document.createElement('section'); // cria elemento 'section' no DOM
  section.className = 'item'; // acrescenta a classe 'item' a section criada

  section.appendChild(createCustomElement('span', 'item__sku', sku)); // agrega ao elemento section, elemento 'span' com os valores da chave sku
  section.appendChild(createCustomElement('span', 'item__title', name)); // agrega ao elemento section, elemento 'span' com os valores da chave name
  section.appendChild(createProductImageElement(image)); // agrega ao elemento section, elemento 'img' com os valores da chave image
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!')); // agrega ao elemento section, um botao para adicionar item ao carrinho

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // START
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
