let totalPrice = 0;
const roundToTwoDecimals = num => Math.round((num * 100) + Number.EPSILON) / 100;
const createSectionTotalPriceAssyncAwait = async (totalprice) => {
  try {
    const span = await document.createElement('span');
    span.className = 'total-price';
    span.innerHTML = `${totalprice}`;
    const sectionOl = await document.querySelector('.cart');
    sectionOl.appendChild(span);
  } catch (error) {
    window.alert(error);
  }
};
  // Deleta o texto de preço total
const deleteSectionTotalPriceAssyncAeait = async () => {
  try {
    const span = await document.querySelector('.total-price');
    const sectionOl = await document.querySelector('.cart');
    sectionOl.removeChild(span);
  } catch (error) {
    window.alert(error);
  }
};
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
const handleWithSearchResults = (object) => {
  object.results.forEach((result) => {
    const infosComput = {};
    infosComput.sku = result.id;
    infosComput.name = result.title;
    infosComput.image = result.thumbnail;
    const section = document.querySelector('.items');
    section.appendChild(createProductItemElement(infosComput));
  });
};

const fetchComputers = (endpoint) => {
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.results.length === 0) {
        error = 'Produto não existe';
        throw new Error(error);
      }
      handleWithSearchResults(object);
    })
    .catch((error) => {
      window.alert(error);
    });
};
function createStoreItens() {
  const endpoint = 'https://api.mercadolibre.com/sites/MLB/search?q=computador';
  fetchComputers(endpoint);
}

function cartItemClickListener(event) {
  // coloque seu código aqui
  const ol = document.querySelector('ol');
  const li = document.querySelectorAll('.cart__item');
  li.forEach((liItem) => {
    const textOfClickedLi = event.path[0].innerText;
    const itemPrice = parseFloat(event.path[0].id);
    if (liItem.innerText === textOfClickedLi) {
      totalPrice -= itemPrice;
      totalPrice = roundToTwoDecimals(totalPrice);
      createSectionTotalPriceAssyncAwait(totalPrice);
      deleteSectionTotalPriceAssyncAeait();
      ol.removeChild(liItem);
    }
  });
}

function createCartItemElement({ sku, name, salePrice }) {
  deleteSectionTotalPriceAssyncAeait();
  totalPrice += salePrice;
  createSectionTotalPriceAssyncAwait(totalPrice);
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.id = salePrice;
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}
const handleWithSearchId = (object) => {
  const ol = document.querySelector('.cart__items');
  const infosItem = {};
  infosItem.sku = object.id;
  infosItem.name = object.title;
  infosItem.salePrice = object.price;
  ol.appendChild(createCartItemElement(infosItem));
};

const fetchItemById = (id) => {
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      handleWithSearchId(object);
    })
  .catch((error) => {
    window.alert(error);
  });
};

window.onload = function onload() {
  // Chamada de funções e recuperação de variáveis
  createStoreItens();
  const sectionOfItensStore = document.querySelector('.items');
  sectionOfItensStore.addEventListener('click', (event) => {
    const itemId = event.path[1].childNodes[0].innerText;
    fetchItemById(itemId);
  });
  createSectionTotalPriceAssyncAwait(totalPrice);
  const buttonCleanCart = document.querySelector('.empty-cart');
  buttonCleanCart.addEventListener('click', () => {
    const allCartLi = document.querySelectorAll('.cart__item');
    const ol = document.querySelector('.cart__items');
    allCartLi.forEach((li) => {
      ol.removeChild(li);
      });
    totalPrice = 0;
    deleteSectionTotalPriceAssyncAeait();
    createSectionTotalPriceAssyncAwait(totalPrice);
  });
};
