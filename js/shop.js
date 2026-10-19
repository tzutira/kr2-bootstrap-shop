"use strict";

// Shared demo catalogue. No personal data is stored or sent.
const products = [
  {
    "id": "1",
    "name": "Широкие джинсы Coated Noir",
    "image": "images/black-coated-wide-leg-jeans.jpg",
    "alt": "Широкие джинсы Coated Noir, цвет чёрный, вид спереди",
    "description": "Высокая посадка, широкие штанины и чёрный деним\n              с покрытием. Выразительная основа образа.",
    "price": "5 900 ₽",
    "badge": "Новинка",
    "badgeClass": "bg-success",
    "category": "Джинсы",
    "color": "Чёрный"
  },
  {
    "id": "2",
    "name": "Бордовая куртка",
    "image": "images/burgundy-leather-jacket.jpg",
    "alt": "Бордовая куртка, цвет бордовый, вид спереди",
    "description": "Прямой силуэт, отложной воротник и застёжка\n              на молнии. Бордовый акцент для многослойных образов.",
    "price": "12 900 ₽",
    "badge": "Скидка",
    "badgeClass": "bg-danger",
    "category": "Куртки",
    "color": "Бордовый"
  },
  {
    "id": "3",
    "name": "Кремовое поло на молнии",
    "image": "images/cream-zip-polo.jpg",
    "alt": "Кремовое поло на молнии, цвет кремовый, вид спереди",
    "description": "Трикотаж в рубчик, короткий рукав и воротник\n              с молнией. Светлая фактура для сочетания с широкими брюками.",
    "price": "3 200 ₽",
    "badge": "База",
    "badgeClass": "bg-secondary",
    "category": "Поло",
    "color": "Кремовый"
  },
  {
    "id": "4",
    "name": "Серые широкие брюки",
    "image": "images/grey-wide-leg-trousers.jpg",
    "alt": "Серые широкие брюки, цвет светло-серый, вид спереди",
    "description": "Широкий крой и стрелки. Структурированный силуэт,\n              который сочетается с рубашкой или свободным трикотажем.",
    "price": "5 400 ₽",
    "badge": "Хит",
    "badgeClass": "bg-warning text-dark",
    "category": "Брюки",
    "color": "Светло-серый"
  },
  {
    "id": "5",
    "name": "Свитер Destroy Knit",
    "image": "images/grey-distressed-sweater.jpg",
    "alt": "Свитер Destroy Knit, цвет серый, вид спереди",
    "description": "Свободный серый трикотаж с намеренными потёртостями\n              и рваными краями. Фактурный акцент коллекции.",
    "price": "6 900 ₽",
    "badge": "Коллекция",
    "badgeClass": "bg-secondary",
    "category": "Свитеры",
    "color": "Серый"
  },
  {
    "id": "6",
    "name": "Белая свободная рубашка",
    "image": "images/white-relaxed-shirt.jpg",
    "alt": "Белая свободная рубашка, цвет белый, вид спереди",
    "description": "Свободная посадка, классический воротник\n              и удлинённый округлый низ. Для самостоятельного\n              образа или второго слоя.",
    "price": "3 900 ₽",
    "badge": "База",
    "badgeClass": "bg-secondary",
    "category": "Рубашки",
    "color": "Белый"
  }
];
const selectedId = new URLSearchParams(window.location.search).get("product") || "1";
const selectedProduct = products.find((product) => product.id === selectedId);

if (document.querySelector("#product-details")) {
  if (selectedProduct) {
    document.title = `${selectedProduct.name} — Artel Studio`;
    document.querySelectorAll("[data-product-field]").forEach((element) => {
      element.textContent = selectedProduct[element.dataset.productField];
    });
    const image = document.querySelector("#product-image");
    image.src = selectedProduct.image;
    image.alt = selectedProduct.alt;
    const badge = document.querySelector("#product-badge");
    badge.className = `badge ${selectedProduct.badgeClass} mb-3`;
    badge.textContent = selectedProduct.badge;
    document.querySelector("#product-order-link").href = `order.html?product=${selectedProduct.id}`;
  } else {
    document.querySelector("#product-details").hidden = true;
    document.querySelector("#product-not-found").classList.remove("d-none");
    document.querySelector("[data-product-field='name']").textContent = "Товар не найден";
    document.title = "Товар не найден — Artel Studio";
  }
}

const productSelect = document.querySelector("#order-product");
if (productSelect && selectedProduct && new URLSearchParams(location.search).has("product")) {
  productSelect.value = selectedProduct.id;
}

const orderModal = document.querySelector("#orderModal");
orderModal?.addEventListener("show.bs.modal", (event) => {
  const product = products.find((item) => item.id === event.relatedTarget?.dataset.product);
  if (!product) { event.preventDefault(); return; }
  document.querySelector("#quick-order").reset();
  document.querySelector("#modal-product").value = product.id;
  document.querySelector("#modal-product-name").textContent = `${product.name} — ${product.price}`;
  document.querySelector("#modal-order-link").href = `order.html?product=${product.id}`;
});
orderModal?.addEventListener("shown.bs.modal", () => document.querySelector("#modal-name").focus());

// Native required/email/pattern checks run before submit; these add digit counts.
document.querySelectorAll("input[type='tel']").forEach((input) => {
  input.addEventListener("input", () => {
    const digits = input.value.replace(/\D/g, "").length;
    const valid = !input.value || (input.id === "order-phone" ? digits === 10 : digits >= 10 && digits <= 15);
    input.setCustomValidity(valid ? "" : input.id === "order-phone" ? "Введите 10 цифр без +7." : "Введите от 10 до 15 цифр телефона.");
  });
});
document.querySelectorAll("[data-demo-form]").forEach((form) => {
  const result = form.querySelector("[data-form-result]");
  const hideResult = () => result.classList.add("d-none");
  form.addEventListener("input", hideResult);
  form.addEventListener("change", hideResult);
  form.addEventListener("reset", () => {
    hideResult();
    form.querySelectorAll("input").forEach((input) => input.setCustomValidity(""));
  });
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const product = products.find((item) => item.id === new FormData(form).get("product"));
    if (!product) return;
    result.textContent = `Учебная заявка на «${product.name}» подготовлена. Данные проверены в браузере и не отправлены. Настоящий заказ не создан.`;
    result.classList.remove("d-none");
    result.focus();
  });
});

// Submit is enabled only after demo handlers are installed.
document.querySelectorAll('button[type="submit"]').forEach((button) => {
  button.disabled = false;
});
