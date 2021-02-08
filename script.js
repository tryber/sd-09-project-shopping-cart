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

async function totalCart() {
  const cart = document.querySelectorAll('.cart__item');
  let totalCartItems = 0;

  try {
    cart.forEach((item) => {
      totalCartItems += Number(item.innerText.split('$')[1]);
    });
  } catch (error) {
    console.log('O resultado não pôde sere obtido.');
  }

  return totalCartItems;
}

async function showTotalCart() {
  const totalPrice = document.querySelector('.total-price');
  totalPrice.innerText = '';
  const total = document.createElement('p');
  total.innerText = `${await totalCart()}`;
  totalPrice.appendChild(total);
}

const saveLocal = () => {
  localStorage.setItem('saveLocal', document.querySelector('.cart__items').innerHTML);
};

function cartItemClickListener(event) {
  event.target.remove();
  showTotalCart();
  saveLocal();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const addToCart = async (itemId) => {
  try {
    const response = await fetch(`https://api.mercadolibre.com/items/${itemId}`);
    const itemJson = await response.json();

    const { id: sku, title: name, price: salePrice } = itemJson;
    document.querySelector('.cart__items').appendChild(createCartItemElement({ sku, name, salePrice }));
    saveLocal();
    showTotalCart();
  } catch (error) {
    console.log('Erro ao adicionar item ao carrinho.');
  }
};

const setLoading = () => {
  const loading = document.createElement('h2');
  loading.className = 'loading';
  loading.innerText = 'loading...';
  document.querySelector('.items').appendChild(loading);
};

const fetchProducts = async (search) => {
  try {
    setLoading();
    const response = await fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${search}`);
    const resultsJson = await response.json();
    const result = await resultsJson.results;

    setTimeout(() => {
      document.querySelector('.items h2').remove();
      result.forEach(({ id: sku, title: name, thumbnail: image }) => {
        document.querySelector('.items').appendChild(createProductItemElement({ sku, name, image }))
          .lastChild.addEventListener('click', (event) => {
            const id = event.target.parentNode.firstChild.innerText;
            addToCart(id);
            saveLocal();
          });
      });
    }, 700);
  } catch (error) {
    console.log('Erro ao criar lista de produtos');
  }
};

const restoreLocal = () => {
  const selectItem = document.querySelector('.cart__items');
  if (localStorage.saveLocal) {
    selectItem.innerHTML = localStorage.getItem('saveLocal');
    selectItem.addEventListener('click', (event) => {
      if (event.target.classList.contains('cart__item')) {
        cartItemClickListener(event);
      }
    });
  }
};

const clearCart = () => {
  document.querySelector('.empty-cart').addEventListener('click', () => {
    localStorage.removeItem('saveLocal');
    document.querySelector('.cart__items').innerText = '';
    showTotalCart();
  });
};

window.onload = function onload() {
  fetchProducts('computador');
  restoreLocal();
  clearCart();
  showTotalCart();
};
