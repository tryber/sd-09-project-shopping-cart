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

function sumPrice() {
  const sumTotal = document.querySelector('.total-price');
  const allli = document.querySelectorAll('li');
  let sum = 0;
  if (allli.length === 0) {
    return (sumTotal.innerHTML = 0);
  }
  return allli.forEach(async (element) => {
    const id = element.innerText.split(' ')[1];
    const endpoint = `https://api.mercadolibre.com/items/${id}`;
    try {
      await fetch(endpoint)
      .then(response => response.json())
      .then((object) => {
        sum += (object.price);
        const formatSum = Math.round(sum * 100) / 100;
        return (sumTotal.innerHTML = formatSum);
      });
    } catch (erro) {
      window.alert(erro);
    }
  });
}

const newObject = (element) => {
  const { id, title, thumbnail, price } = element;
  const object = {
    sku: id,
    name: title,
    image: thumbnail,
    salePrice: price,
  };
  return object;
};

const loopButtons = (className, functionName) => {
  const buttons = document.querySelectorAll(className);
  if (buttons.length === 0) {
    return;
  }
  buttons.forEach(button => button.addEventListener('click', functionName));
};

const salveItem = () => {
  const listItem = document.querySelectorAll('li');
  const priceTotal = document.querySelector('.total-price');
  const arrayItem = [];
  listItem.forEach((element) => {
    arrayItem.push(element.className);
    arrayItem.push(element.innerText);
  });
  localStorage.setItem('listItemCart', JSON.stringify(arrayItem));
  localStorage.setItem('priceItemTotal', priceTotal.innerHTML);
};

function cartItemClickListener(event) {
  // coloque seu código aqui.
  event.target.remove();
  sumPrice();
  salveItem();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);

  return li;
}

const fetchListCart = (id) => {
  const listCartMain = document.querySelector('.cart__items');
  const endpoint = `https://api.mercadolibre.com/items/${id}`;
  removeAndAddLoading('block');

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      listCartMain.appendChild(createCartItemElement(newObject(object)));
      removeAndAddLoading('none')
      sumPrice();
      salveItem();
    })
    .catch(erro => console.log(erro));
};

const createItemList = event => fetchListCart(getSkuFromProductItem(event.path[1]));

const removeAndAddLoading = (string) => {
  const loading = document.querySelector('.loading');
  loading.style.display = string;
}

const fetchMercadoLivre = (id) => {
  const sectionMain = document.querySelector('.items');
  const endpoint = `https://api.mercadolibre.com/sites/MLB/search?q=$${id}`;
  removeAndAddLoading('block');

  fetch(endpoint)
    .then(response => response.json())
    .then((object) => {
      if (object.error) {
        throw new Error(object.error);
      }
      object.results.forEach((element) => {
        sectionMain.appendChild(createProductItemElement(newObject(element)));
        loopButtons('.item__add', createItemList);
      });
      removeAndAddLoading('none')
    })
    .catch(() => console.log('ERRO'));
};

const addListItem = (text, className) => {
  const listCartMain = document.querySelector('.cart__items');
  const li = document.createElement('li');
  li.className = className;
  li.innerText = text;
  li.addEventListener('click', cartItemClickListener);

  listCartMain.appendChild(li);
};

const clearListItem = () => {
  const allList = document.querySelectorAll('.cart__item');
  allList.forEach(element => element.remove());
  sumPrice();
  salveItem();
};

const clearButton = () => {
  const buttonClear = document.querySelector('.empty-cart');
  buttonClear.addEventListener('click', clearListItem);
};

const returnLocalStorage = () => {
  const arrayItem = JSON.parse(localStorage.getItem('listItemCart'));
  const priceLocalStorage = localStorage.getItem('priceItemTotal');
  const priceTotal = document.querySelector('.total-price');
  if (arrayItem === null) {
    return;
  }

  for (let index = 0; index < arrayItem.length; index += 2) {
    const className = arrayItem[index];
    const text = arrayItem[index + 1];
    addListItem(text, className);
  }
  priceTotal.innerHTML = priceLocalStorage;
};

window.onload = () => {
  fetchMercadoLivre('computador');
  returnLocalStorage();
  clearButton();
};
