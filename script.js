function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}
// Função para criar novos elementos
function createCustomElement(element, className, innerText, sku) { // recebe o tipo de elemento, nome da classe, texto do conteúdo e código do produto (id)
  const e = document.createElement(element); // Cria novo elemento com a tag = element recebido
  e.className = className; // Adiciona uma classe ao novo elemento
  e.innerText = innerText; // Adiciona um texto dentro do novo elemento
  if (element === 'button' && className === 'item__add') { // Verifica se o elemento é um botão e contem a classe 'item__add'
    e.id = sku; // atribui um ID = ao código recebido
    e.addEventListener('click', () => { // Adiciona um evento de click
      cartItemClickListener(e.id); // chama a função para consultar a API passando o SKU que é o ID do botão 
    });
  }
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!', sku));
  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// Função para criar um novo item à lista
function createCartItemElement({ id: sku, title: name, price: salePrice }) { // recebe os dados do produto (id, title e price)
  const li = document.createElement('li'); // cria um li (list item)
  li.className = 'cart__item'; // adiciona uma classe ao item
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`; // adiciona o texto com SKU, name e price do produto selecionado
  return li;
}

// Função para pegar os detalhes do item passado como parâmetro (função chamada em createCustomElement)
const cartItemClickListener = async (itemID) => { // recebe o id (sku)
  try {
    const productDetails = `https://api.mercadolibre.com/items/${itemID}`; // busca na API pelo ID do produto
    await fetch(productDetails) // recebe os dados
      .then(response => response.json()) // recebe os dados json
      .then((object) => { // pega o objeto retornado no json
        const newProduct = createCartItemElement(object); // chama a função para criar um novo item na lista, passando como parâmetro o objeto json (dados do produtos)
        document.querySelector('.cart__items').appendChild(newProduct); // o item de lista criado é adicionado à lista de produtos do carrinho
      });
  } catch (error) {
    console.log(`Ocorreu um erro: ${error}`);
  }
};

const fetchItems = async (product) => {
  try {
    const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=${product}`;
    await fetch(endpoint)
      .then(response => response.json())
      .then(object => object.results.forEach((productItem) => {
        const itemElement = createProductItemElement(productItem);
        document.querySelector('.items').appendChild(itemElement);
      }));
  } catch (error) {
    console.log(`Houve um erro: ${error}`);
  }
};

const setupEvents = () => {
  fetchItems('computador');
};

window.onload = function onload() {
  setupEvents();
};
