function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

const setLocalStorage = (produto) => {
  const ls = JSON.parse(localStorage.getItem('cart')) || [];
  ls.push(produto);
  localStorage.setItem('cart', JSON.stringify(ls));
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function cartItemClickListener(event) {
  event.target.remove();
}

const getLocalStorage = () => {
  const ls = JSON.parse(localStorage.getItem('cart'));
  if (!ls) return;
  const lista = document.querySelector('.cart__items');
  ls.forEach((element) => {
    lista.innerHTML += element;
    lista.addEventListener('click', cartItemClickListener);
  });
};

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  setLocalStorage(li.outerHTML);
  return li;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function addItemNoCarrinho(id) {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
  .then(response => response.json()
      .then((object) => {
        const itens = document.querySelector('.cart__items');
        const itensInfo = {
          sku: object.id,
          name: object.title,
          salePrice: object.price,
        };
        const addItem = createCartItemElement(itensInfo);
        itens.appendChild(addItem);
      }),
  );
}

async function resolveCarrinho(event) {
  const selectElement = await event.target.parentElement;
  await addItemNoCarrinho(getSkuFromProductItem(selectElement));
}


function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  const createCustomEl = createCustomElement('button', 'item__add', 'Adicionar ao carrinho!');
  createCustomEl.addEventListener('click', resolveCarrinho);
  section.appendChild(createCustomEl);

  return section;
}
const criaLista = () => {
  const itens = document.querySelector('.items');
  const link = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetch(link)
  .then(resposta => resposta.json())
  .then(obj => obj.results)
  .then((array) => {
    array.forEach((obj) => {
      const { id: sku, title: name, thumbnail: image } = obj;
      const section = createProductItemElement({ sku, name, image });
      itens.appendChild(section);
    });
    const loading = document.querySelector('.loading');
    loading.remove();
  })
  .catch(error => window.alert(error));
};
criaLista();

function limparTudo() {
  const selectButton = document.querySelector('.empty-cart');
  selectButton.addEventListener('click', function () {
    const selectLista = document.querySelectorAll('.cart__item');
    selectLista.forEach(element => element.remove());
    localStorage.clear();
  });
}

window.onload = function onload() {
  criaLista();
  limparTudo();
  getLocalStorage();
};
