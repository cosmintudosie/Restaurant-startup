`use strict`;
const navBar = document.querySelector(".nav-bar");
// const navButtons = document.querySelectorAll(".nav-link:not(.day-menu)");
const carousel = document.querySelector(".carousel");
const about = document.querySelector(".about");
const linksList = document.querySelector(".links-list");
const badge = document.querySelector(".badge");
const displayElements = document.querySelector(".display-elements");
const logo = document.querySelector(".logo");
const btnBack = document.querySelector(".btn-back");
const menu = document.querySelector("#full-menu");
const menuElements = document.querySelectorAll(".menu-elements");
const elementTitle = document.querySelector(".element-title");
const main = document.querySelector(".main");
const dishes = document.querySelectorAll(".dishes");
const dishContainer = document.querySelector(".dish-container");
const listDishes = document.querySelector(".list-dishes");
const rightDishes = document.querySelector(".right-dishes");
const dailyDishes = document.querySelector(".daily-dishes");
const cardDiv = document.querySelector(".card-div");
const cart = document.querySelector("#cart");
const cartTotal = document.querySelector(".cart-total");
const listCart = document.querySelector(".list-cart");

//const listCarts = document.querySelectorAll(".list-cart")
let card = document.querySelector(".card");
let shop = document.querySelector(".shop");
const shoppingCart = document.querySelector(".shopping-cart");
const listMenu = document.querySelector(".list-menu");
const cmdBtn = document.querySelector(".cmd-btn");
const adress = document.querySelector("#adress");
const phone = document.querySelector("#phone");
const confirmCommand = document.querySelector(".confirm-command");
const confirmBtn = document.querySelector(".confirm-btn");
const emptyField = () => {
  document
    .querySelectorAll(".main>section")
    .forEach((el) => (el.style.display = "none"));
};
const activate = (el) => {
  el.classList.add("active");
};

let Obj = [];

const populateMenu = function () {
  let requestOptions = {
    method: "GET",
  };
  fetch(`/populate`, requestOptions)
    .then((response) => response.json())
    .then((Obj) => {
      Obj.forEach((el) => {
        el.displayCard = function (card) {
          let recipe = `
           <div class="card presentationCard">
           <h1>${card.title}</h1>   
      <img 
      
      src=${card.imgSrc} />
          <ul>
            Ingrediente:
            ${card.ingredients}
            </ul>
            <p>${card.price}  RON</p>
            <button class="small-button " onclick="addToCart('${card.title}','${card.price}')">Comanda</button>
            </div>
            `;

          cardDiv.innerHTML = recipe;
          cardDiv.style.display = "block";
        };

        el.displayList = function () {
          let itemsInList = document.createElement("a");
          itemsInList.innerHTML = `${this.title} ....  ${this.price} RON`;
          itemsInList.classList = "list-menu meal-link";

          itemsInList.style.position = "relative";
          itemsInList.addEventListener("click", () => el.displayCard(this));

          listDishes.append(itemsInList);
        };
        if (el.daily) {
          let mealsForDaily = document.createElement("a");
          mealsForDaily.innerHTML = `${el.title} ....  ${el.price} RON`;
          mealsForDaily.classList = "meal-link";
          mealsForDaily.dataset.aos = "fade-right";
          mealsForDaily.dataset.aosDuration = "1500";

          mealsForDaily.addEventListener("click", () => {
            el.displayCard(el);
            card = document.querySelector(".card");
          });
          rightDishes.append(mealsForDaily);
        }
      });

      //--------DISHES LINKS -------------
      menuElements.forEach((el) =>
        el.addEventListener("click", (ev) => {
          emptyField();

          dishContainer.style.display = "flex";
          listDishes.innerHTML = "";
          Obj.filter((el) => el.category === ev.target.id).forEach((el) => {
            elementTitle.innerHTML = el.category;

            el.displayList();
          });
        })
      );
    });
};
populateMenu();

/////------ SHOPPING CART---------
let objectsInCart = [];

function updateBadge() {
  if (!objectsInCart[0]) {
    return;
  }
  badge.style.display = "inline-block";
  badge.textContent = objectsInCart
    .map((el) => el.times)
    .reduce((a, b) => a + b);
  if (badge.textContent === "0") badge.style.display = "none";
}

function showCart() {
  shoppingCart.innerHTML = "";

  objectsInCart
    .filter((el) => el.times !== 0)
    .map((object) => {
      let itemsInCart = `
<div class="list-cart">
<h3>${object.title}</h3>   
<button class=" btnChg" onclick='reduceQty("${object.title}")'>-</button><p>${object.times}</p><button class=" btnChg" onclick='addQty("${object.title}")'>+</button>
<p>${object.price}  RON</p>

  </div>

`;

      shoppingCart.innerHTML += itemsInCart;
    });

  let initialValue = 0;
  cartTotal.innerHTML =
    objectsInCart.reduce(function (accumulator, curValue) {
      return accumulator + curValue.times * curValue.price;
    }, initialValue) + " RON" || "";

  if (cartTotal.textContent === "0 RON") {
    cartTotal.innerHTML = "Lista este goala";
  }

  shop.style.display = "flex";
}
cart.addEventListener("click", showCart);

function addQty(title, times) {
  objectsInCart.find((el) => el.title === title).times += 1;
  showCart();
  updateBadge();
}

function reduceQty(title, times) {
  objectsInCart.find((el) => el.title === title).times -= 1;
  showCart();
  updateBadge();
}

function addToCart(title, price) {
  let objInCart = {
    title: title,
    price: price,
    times: 1,
  };
  let duplicate = objectsInCart.find((el) => el.title === title);

  if (duplicate) {
    duplicate.times += 1;
  } else {
    objectsInCart.push(objInCart);
  }
  updateBadge();
}

//-------- NAV BUTTONS ACTIVITY ---------------

function showMenu() {
  emptyField();
  document.querySelector(".full-menu").style.display = "block";
}
btnBack.onclick = showMenu;
menu.onclick = showMenu;
logo.onclick = function () {
  emptyField();
  carousel.style.display = "block";
  about.style.display = "block";
};

///////////------------- NAVIGATION BUTTON---------------
const btnNav = document.querySelector(".btn-nav");
const btnOff = document.querySelector(".icon-nav[name=close-outline]");
const btnOn = document.querySelector(".icon-nav[name=menu-outline]");
btnNav.addEventListener("click", () => {
  navBar.classList.toggle("open-nav");
});
//////-----CLICK OUTSIDE------

document.addEventListener("click", function (e) {
  if (!cart) return;

  if (
    !shop.contains(e.target) &&
    !cart.contains(e.target) &&
    e.target.innerHTML !== "+" &&
    e.target.innerHTML !== "-"
  ) {
    shop.style.display = "none";
  }
  if (
    !cardDiv.contains(e.target) &&
    !listDishes.contains(e.target) &&
    !dailyDishes.contains(e.target)
  ) {
    cardDiv.style.display = "none";
  }
  let openedList = document.querySelector(".open-nav .links-list");

  if (
    openedList &&
    !openedList.contains(e.target) &&
    !navBar.contains(e.target) &&
    navBar.classList.contains("open-nav")
  ) {
    navBar.classList.remove("open-nav");
  }
});

///////PLACE COMMAND

cmdBtn.addEventListener("click", function (e) {
  e.preventDefault();
  confirmCommand.style.display = "block";

  let order = {
    objects: objectsInCart,
    adress: adress.value,
    phone: phone.value,
  };

  let requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  };
  fetch(`/order`, requestOptions).then((response) => response.json());
});
confirmBtn.addEventListener("click", () => {
  location.reload();
});
