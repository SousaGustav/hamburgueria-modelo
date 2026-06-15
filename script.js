// ========================================
// DADOS DO CARDÁPIO
// ========================================
const menuData = {
  burgers: [
    {
      id: 'b1',
      name: 'Clássico Artesanal',
      description: 'Pão brioche, blend 180g, queijo cheddar, alface, tomate e maionese da casa.',
      price: 28.90,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'b2',
      name: 'Bacon Smash',
      description: 'Duplo blend 100g, bacon crocante, queijo prato, cebola caramelizada e barbecue.',
      price: 34.90,
      image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'b3',
      name: 'Veggie Especial',
      description: 'Hambúrguer de grão de bico e quinoa, queijo brie, rúcula e geleia de pimenta.',
      price: 31.90,
      image: 'https://images.unsplash.com/photo-1525059696034-4967a729002e?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'b4',
      name: 'Cheddar Duplo',
      description: 'Dois blends 120g, dobro de cheddar derretido, cebola crispy e maionese de alho.',
      price: 36.90,
      image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?q=80&w=600&auto=format&fit=crop'
    }
  ],
  sides: [
    {
      id: 's1',
      name: 'Batata Rústica',
      description: 'Batatas assadas com casca, alecrim e flor de sal, acompanha maionese da casa.',
      price: 16.90,
      image: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 's2',
      name: 'Onion Rings',
      description: 'Anéis de cebola empanados e crocantes, servidos com molho barbecue.',
      price: 18.90,
      image: 'https://images.unsplash.com/photo-1639024471283-03518883512d?q=80&w=600&auto=format&fit=crop'
    }
  ],
  drinks: [
    {
      id: 'd1',
      name: 'Refrigerante Lata',
      description: 'Coca-Cola, Guaraná ou Fanta - 350ml geladinho.',
      price: 6.50,
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=600&auto=format&fit=crop'
    },
    {
      id: 'd2',
      name: 'Limonada Artesanal',
      description: 'Limão fresco, hortelã e xarope da casa - 400ml.',
      price: 9.90,
      image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?q=80&w=600&auto=format&fit=crop'
    }
  ]
};

// ========================================
// ESTADO DO CARRINHO
// ========================================
let cart = [];

const WHATSAPP_NUMBER = '5585991067509'; // Substituir pelo número real (formato 55DDDNUMERO)

// ========================================
// FORMATAÇÃO
// ========================================
function formatPrice(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ========================================
// RENDERIZAÇÃO DO CARDÁPIO
// ========================================
function renderMenu() {
  renderGrid('grid-burgers', menuData.burgers);
  renderGrid('grid-sides', menuData.sides);
  renderGrid('grid-drinks', menuData.drinks);
}

function renderGrid(elementId, items) {
  const grid = document.getElementById(elementId);
  grid.innerHTML = items.map(item => `
    <div class="menu-card">
      <div class="menu-card__image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="menu-card__body">
        <h4 class="menu-card__title">${item.name}</h4>
        <p class="menu-card__desc">${item.description}</p>
        <div class="menu-card__footer">
          <span class="menu-card__price">${formatPrice(item.price)}</span>
        </div>
        <button class="btn--add" data-id="${item.id}">+ Adicionar ao Carrinho</button>
      </div>
    </div>
  `).join('');
}

// ========================================
// FUNÇÕES DO CARRINHO
// ========================================
function findItemById(id) {
  return [...menuData.burgers, ...menuData.sides, ...menuData.drinks].find(item => item.id === id);
}

function addToCart(id) {
  const product = findItemById(id);
  if (!product) return;

  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCartUI();
  showToast(`${product.name} adicionado ao carrinho!`);
}

function increaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) item.qty += 1;
  updateCartUI();
}

function decreaseQty(id) {
  const item = cart.find(i => i.id === id);
  if (item) {
    item.qty -= 1;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
  }
  updateCartUI();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCartUI();
}

function getCartTotal() {
  return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.qty, 0);
}

// ========================================
// RENDERIZAÇÃO DO CARRINHO
// ========================================
function updateCartUI() {
  const cartBody = document.getElementById('cartBody');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');

  cartCount.textContent = getCartCount();
  cartTotal.textContent = formatPrice(getCartTotal());

  if (cart.length === 0) {
    cartBody.innerHTML = `<p class="cart-empty">Seu carrinho está vazio.</p>`;
    return;
  }

  cartBody.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item__image">
        <img src="${item.image}" alt="${item.name}">
      </div>
      <div class="cart-item__info">
        <div class="cart-item__name">${item.name}</div>
        <div class="cart-item__price">${formatPrice(item.price)}</div>
        <div class="cart-item__controls">
          <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
          <span class="cart-item__qty">${item.qty}</span>
          <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
          <button class="cart-item__remove" data-action="remove" data-id="${item.id}">Remover</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ========================================
// TOAST
// ========================================
let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// ========================================
// MODAL DO CARRINHO
// ========================================
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');

function openCart() {
  cartModal.classList.add('active');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  cartModal.classList.remove('active');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

cartBtn.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// ========================================
// EVENTOS DELEGADOS - ADICIONAR / QUANTIDADE
// ========================================
document.addEventListener('click', (e) => {
  const addBtn = e.target.closest('.btn--add');
  if (addBtn) {
    addToCart(addBtn.dataset.id);
    return;
  }

  const qtyBtn = e.target.closest('.qty-btn, .cart-item__remove');
  if (qtyBtn) {
    const id = qtyBtn.dataset.id;
    const action = qtyBtn.dataset.action;

    if (action === 'increase') increaseQty(id);
    if (action === 'decrease') decreaseQty(id);
    if (action === 'remove') removeFromCart(id);
  }
});

// ========================================
// MENU MOBILE (HAMBURGER)
// ========================================
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');

menuToggle.addEventListener('click', () => {
  nav.classList.toggle('active');
});

document.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('active');
  });
});

// ========================================
// FORMA DE PAGAMENTO
// ========================================
const paymentMethod = document.getElementById('paymentMethod');
const changeField = document.getElementById('changeField');
const changeFor = document.getElementById('changeFor');

paymentMethod.addEventListener('change', () => {
  if (paymentMethod.value === 'Dinheiro') {
    changeField.classList.add('active');
  } else {
    changeField.classList.remove('active');
    changeFor.value = '';
  }
});

// ========================================
// FINALIZAR PEDIDO VIA WHATSAPP
// ========================================
checkoutBtn.addEventListener('click', () => {
  const nameInput = document.getElementById('customerName');
  const addressInput = document.getElementById('customerAddress');

  const customerName = nameInput.value.trim();
  const customerAddress = addressInput.value.trim();
  const payment = paymentMethod.value;
  const change = changeFor.value.trim();

  // Validações
  if (cart.length === 0) {
    showToast('Seu carrinho está vazio!');
    return;
  }

  if (!customerName) {
    showToast('Por favor, informe seu nome.');
    nameInput.focus();
    return;
  }

  if (!customerAddress) {
    showToast('Por favor, informe o endereço de entrega.');
    addressInput.focus();
    return;
  }

  if (!payment) {
    showToast('Por favor, selecione a forma de pagamento.');
    paymentMethod.focus();
    return;
  }

  if (payment === 'Dinheiro' && !change) {
    showToast('Informe o valor para troco.');
    changeFor.focus();
    return;
  }

  // Montagem da mensagem
  let message = '🍔 *NOVO PEDIDO - BURGER & CO.*\n\n';
  message += '*Itens do pedido:*\n';

  cart.forEach(item => {
    message += `▪ ${item.qty}x ${item.name} - ${formatPrice(item.price * item.qty)}\n`;
  });

  message += `\n*Total: ${formatPrice(getCartTotal())}*\n`;
  message += '\n----------------------------\n';
  message += `*Nome:* ${customerName}\n`;
  message += `*Endereço de entrega:* ${customerAddress}\n`;
  message += `*Forma de pagamento:* ${payment}\n`;

  if (payment === 'Dinheiro') {
    message += `*Troco para:* ${change}\n`;
  }

  message += '\nAguardo a confirmação. Obrigado!';

  const encodedMessage = encodeURIComponent(message);
  const whatsappURL = `https://api.whatsapp.com/send?phone=${5585991067509}&text=${encodedMessage}`;

  window.open(whatsappURL, '_blank');
});
// ========================================
// HEADER - SOMBRA AO ROLAR (opcional/visual)
// ========================================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 20) {
    header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
  } else {
    header.style.boxShadow = 'none';
  }
});

// ========================================
// INICIALIZAÇÃO
// ========================================
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  updateCartUI();
});