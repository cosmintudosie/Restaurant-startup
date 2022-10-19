const formContainer = document.querySelector(".form-container");
const adminForm = document.querySelector(".admin-form");

const formBtn = document.querySelector(".admin-form button");

////////----------INGREDIENTS FORM----------
let newInput = `<div>
<input name="ingredients" />
<button class="small-button add-ingredient" type="button" onclick="addNewIngredient()" >+</button>
<button class="small-button rem-ingredient" type="button" onclick="remNewIngredient(event)">-</button>
</div>`;
function addNewIngredient() {
  formContainer.insertAdjacentHTML("beforeend", newInput);
}
function remNewIngredient(event) {
  // console.log(document.querySelectorAll(".form-container div").length);
  if (formContainer.querySelectorAll("div").length === 1) {
    return;
  }
  event.target.parentElement.remove();
}

//////-----POPULATE FULL MENU-------

const listMenu = document.querySelector(".list-menu");

const populateMenu = function () {
  let requestOptions = {
    method: "GET",
  };
  fetch(`http://localhost:3000/populate`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      data.map((el) => {
        let element = ` <div>
          <p>
            ${el.title} (Ingrediente: ${el.ingredients})....  ${el.price} RON
          </p>
          <button class="small-button rem-dish" name="${el.title}" onclick="remItem(name)">X</button>
          <input type="checkbox" id="${el.title}" name="${el.title}" onclick="addToDaily(name)">
          <label for="daily"> Meniul Zilei</label>
        </div>`;

        let category = document.getElementById(`${el.category}`);

        category.insertAdjacentHTML("beforeend", element);
        let dayMenu = document.getElementById(`${el.title}`);
        dayMenu.checked = el.daily;
        // console.log(dayMenu);
      });
    });
};
populateMenu();

//////////-----REMOVE ITEM FROM LIST-------
const remItem = function (item) {
  let itemToDelete = {
    delItem: item,
  };

  let requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemToDelete),
  };
  fetch(`http://localhost:3000/deleteItem`, requestOptions).then((response) =>
    location.reload()
  );
};

///ADD DAILY MENU

const addToDaily = function (item) {
  let dailyCheck = document.getElementById(`${item}`).checked;
  // console.log(dailyCheck);
  let itemToUpdate = {
    updateItem: item,
    value: dailyCheck,
  };
  let requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemToUpdate),
  };
  fetch(`http://localhost:3000/updateItem`, requestOptions);
  // .then((response) => response.json());
};
/////////ORDERS
const populateOrders = function () {
  let requestOptions = {
    method: "GET",
  };
  fetch(`http://localhost:3000/orderList`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      data.map((el) => {
        let objects = el.objects;
        // (objects) => objects.json();
        let comandObject = JSON.parse(JSON.stringify(objects));
        let comandObjects = comandObject.map(
          (element) =>
            `${element.title}-${element.times}buc.-${element.price}RON <br/>`
        );
        let command = ` <div>
          <div>
            Comanda:<br/>${comandObjects} 
          </div>
          <div>
            Adresa:${el.adress} 
          </div>
          <div>
            Telefon:${el.phone} 
          </div>
          <button class="small-button rem-dish" name="${el.phone}" onclick="remOrder(name)">X</button>
          
        </div>`;

        let orderList = document.querySelector(".orders");

        orderList.insertAdjacentHTML("beforeend", command);
      });
    });
};
populateOrders();

const remOrder = function (item) {
  let itemToDelete = {
    delItem: item,
  };

  let requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(itemToDelete),
  };
  fetch(`http://localhost:3000/deleteOrder`, requestOptions).then((response) =>
    location.reload()
  );
  // .then((response) =>
  //   response.json()
  // );
};
