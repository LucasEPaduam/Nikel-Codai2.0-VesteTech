const myModal = new bootstrap.Modal("#transaction-modal");
let logged = sessionStorage.getItem("logged");
const session = localStorage.getItem("session");
let data = {
  transactions: [],
};

document.getElementById("button-logout").addEventListener("click", logout);
document
  .getElementById("transactions-button")
  .addEventListener("click", function () {
    window.location.href = "transactions.html";
  });

document
  .getElementById("transaction-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const value = parseFloat(document.getElementById("value-input").value);
    const description = document.getElementById("description-input").value;
    const date = document.getElementById("date-input").value;
    const type = document.querySelector("input[name=type-input]:checked").value;

    data.transactions.unshift({
      value: value,
      type: type,
      description: description,
      date: date,
    });

    saveData(data);

    getCashIn();
    getCashOut();
    getTotal();

    e.target.reset();
    myModal.hide();

    alert("Lançamento adicionado com sucesso.");
  });

checkLogged();

function checkLogged() {
  if (session) {
    sessionStorage.setItem("logged", session);
    logged = session;
  }

  if (!logged) {
    window.location.href = "index.html";
    return;
  }

  const dataUser = localStorage.getItem(logged);
  if (dataUser) {
    data = JSON.parse(dataUser);
  }

  getCashIn();
  getCashOut();
  getTotal();
}

function logout() {
  sessionStorage.removeItem("logged");
  localStorage.removeItem("session");

  window.location.href = "index.html";
}

function saveData(data) {
  localStorage.setItem(data.login, JSON.stringify(data));
}

function getCashIn() {
  const transactions = data.transactions;
  const cashIn = transactions.filter((item) => item.type === "1");

  if (cashIn.length) {
    let cashInHtml = ``;
    let limit = cashIn.length > 5 ? 5 : cashIn.length;

    for (let index = 0; index < limit; index++) {
      cashInHtml += `
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div>
                        <h3 class="fs-2 mb-1">R$ ${cashIn[index].value.toFixed(
                          2
                        )}</h3>
                        <p class="mb-0 text-muted">${
                          cashIn[index].description
                        }</p>
                    </div>
                    <div class="mt-2 mt-md-0">
                        <span class="text-end">${cashIn[index].date}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("cash-in-list").innerHTML = cashInHtml;
  }
}

function getCashOut() {
  const transactions = data.transactions;
  const cashOut = transactions.filter((item) => item.type === "2");

  if (cashOut.length) {
    let cashOutHtml = ``;
    let limit = cashOut.length > 5 ? 5 : cashOut.length;

    for (let index = 0; index < limit; index++) {
      cashOutHtml += `
        <div class="row mb-4">
            <div class="col-12">
                <div class="d-flex flex-column flex-md-row justify-content-between align-items-center">
                    <div>
                        <h3 class="fs-2 mb-1">R$ ${cashOut[index].value.toFixed(
                          2
                        )}</h3>
                        <p class="mb-0 text-muted">${
                          cashOut[index].description
                        }</p>
                    </div>
                    <div class="mt-2 mt-md-0">
                        <span class="text-end">${cashOut[index].date}</span>
                    </div>
                </div>
            </div>
        </div>`;
    }

    document.getElementById("cash-out-list").innerHTML = cashOutHtml;
  }
}

function getTotal() {
  const transactions = data.transactions;

  let total = 0;

  transactions.forEach((item) => {
    if (item.type === "1") {
      total += item.value;
    } else {
      total -= item.value;
    }
  });

  document.getElementById("total").innerHTML = `R$ ${total.toFixed(2)}`;
}
