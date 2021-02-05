const itensArray = [];
let total = 0;

const queryElement = async () => {
  total = 0;
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=computador`;
  const result = fetch(endPoint);
  await result.then(resp => resp.json().then((res) => {
    itensArray.forEach((other) => {
      res.results.map((item) => {
        if (other === item.id) {
          total += item.price;
        }
      });
    })
  }));
  setTotal();
};

const saveItens = () => {
  localStorage.setItem('itens', JSON.stringify(itensArray));
};

const clearCar = () => {
  if (itensArray.length !== 0) {
    const ol = document.querySelector('.cart__items');
    const len = ol.children.length;
    for (let index = 0; index < len; index += 1) {
      ol.removeChild(ol.children[0]);
    }
    itensArray.splice(0, itensArray.length);
    saveItens();
  }
};

function cartItemClickListener(event) {
  const ol = document.querySelector('.cart__items');
  ol.removeChild(event.target);
  itensArray.splice(itensArray.indexOf(event.target.id), 1);
  saveItens();
  queryElement();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const setTotal = () => {
  const oldDiv = document.querySelector('.total-price')
  const div = document.createElement('div');
  div.className = 'total-price';
  const p = document.createElement('p');
  p.innerText = total;
  div.appendChild(p);
  const section = document.querySelector('.cart');
  oldDiv !== null ? section.removeChild(oldDiv): undefined;
  section.appendChild(div);
}

const addItemInCart = async (event) => {
  const endPoint = `https://api.mercadolibre.com/items/${event.target.value}`;
  const result = fetch(endPoint);
  await result.then(resp => resp.json().then((res) => {
    const { id: sku, title: name, price: salePrice } = res;
    const li = createCartItemElement({ sku, name, salePrice });
    li.id = sku;
    itensArray.push(sku);
    const ol = document.querySelector('.cart__items');
    ol.appendChild(li);
    total += salePrice;
    setTotal();
  }));
  saveItens();
};

const loadItens = () => {
  const itens = JSON.parse(localStorage.getItem('itens'));
  if (itens !== null) {
    if (itens.length !== 0) {
      itens.forEach((item) => {
        const itemFormated = {
          target: {
            value: item,
          },
        };
        addItemInCart(itemFormated);
      });
    }
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

const queryItensInBd = async (params) => {
  const endPoint = `https://api.mercadolibre.com/sites/MLB/search?q=${params}`;
  const result = fetch(endPoint);
  await result.then(resp => resp.json().then((res) => {
    res.results.map((item, index) => {
      const { id: sku, title: name, thumbnail: image } = item;
      const section = createProductItemElement({ sku, name, image });
      const fatherSection = document.querySelector('.items');
      fatherSection.appendChild(section);
      const buttonAdd = document.querySelectorAll('.item__add')[index];
      buttonAdd.addEventListener('click', addItemInCart);
      buttonAdd.value = item.id;
      return undefined;
    });
  }));
};

const setClearButton = () => {
  const button = document.querySelector('.empty-cart');
  button.addEventListener('click', clearCar);
};

window.onload = function onload() {
  queryItensInBd('computador');
  loadItens();
  setClearButton();
};

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}
