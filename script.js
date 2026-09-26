const descriptionInput = document.getElementById("description");
const amountInput = document.getElementById("amount");
const typeInput = document.getElementById("type");
const addBtn = document.getElementById("addBtn");

const balance = document.getElementById("balance");
const income = document.getElementById("income");
const expense = document.getElementById("expense");
const transactionList = document.getElementById("transactionList");

const searchInput = document.getElementById("searchInput");
const filterInput = document.getElementById("filterInput");

const incomeBar = document.getElementById("incomeBar");
const expenseBar = document.getElementById("expenseBar");

const themeBtn = document.getElementById("themeBtn");

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];

let editId = null;


/* Add / Update */

addBtn.addEventListener("click", () => {

    const description = descriptionInput.value.trim();
    const amount = Number(amountInput.value);
    const type = typeInput.value;

    if (description === "" || amount <= 0) {
        alert("Please enter valid details!");
        return;
    }

    if (editId) {

        transactions = transactions.map(transaction => {

            if (transaction.id === editId) {
                return {
                    ...transaction,
                    description,
                    amount,
                    type
                };
            }

            return transaction;
        });

        editId = null;
        addBtn.textContent = "Add Transaction";

    } else {

        const transaction = {
            id: Date.now(),
            description,
            amount,
            type,
            date: new Date().toLocaleString()
        };

        transactions.push(transaction);
    }

    saveTransactions();
    updateUI();

    descriptionInput.value = "";
    amountInput.value = "";
});


/* Delete */

function deleteTransaction(id) {

    transactions = transactions.filter(
        transaction => transaction.id !== id
    );

    saveTransactions();
    updateUI();
}


/* Edit */

function editTransaction(id) {

    const transaction = transactions.find(
        transaction => transaction.id === id
    );

    descriptionInput.value = transaction.description;
    amountInput.value = transaction.amount;
    typeInput.value = transaction.type;

    editId = id;

    addBtn.textContent = "Update Transaction";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* Save */

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}


/* Update UI */

function updateUI() {

    let totalIncome = 0;
    let totalExpense = 0;

    transactions.forEach(transaction => {

        if (transaction.type === "income") {
            totalIncome += transaction.amount;
        } else {
            totalExpense += transaction.amount;
        }
    });


    /* Search + Filter */

    const searchText =
        searchInput.value.toLowerCase();

    const filterType =
        filterInput.value;


    const filteredTransactions =
        transactions.filter(transaction => {

            const matchesSearch =
                transaction.description
                    .toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                filterType === "all" ||
                transaction.type === filterType;

            return matchesSearch && matchesFilter;
        });


    transactionList.innerHTML = "";


    filteredTransactions.forEach(transaction => {

        const li = document.createElement("li");

        li.innerHTML = `
            <div>
                <strong>
                    ${transaction.description}
                </strong>

                <br>

                <small>
                    ${transaction.date || ""}
                </small>
            </div>

            <div>
                <strong>
                    ${transaction.type === "income" ? "+" : "-"}
                    ₹${transaction.amount.toLocaleString("en-IN")}
                </strong>

                <br>

                <button
                    onclick="editTransaction(${transaction.id})"
                    class="edit-btn">
                    Edit
                </button>

                <button
                    onclick="deleteTransaction(${transaction.id})"
                    class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        transactionList.appendChild(li);
    });


    /* Balance */

    const totalBalance =
        totalIncome - totalExpense;

    income.textContent =
        `₹${totalIncome.toLocaleString("en-IN")}`;

    expense.textContent =
        `₹${totalExpense.toLocaleString("en-IN")}`;

    balance.textContent =
        `₹${totalBalance.toLocaleString("en-IN")}`;


    /* Chart */

    const highestAmount =
        Math.max(totalIncome, totalExpense, 1);

    incomeBar.style.height =
        `${(totalIncome / highestAmount) * 100}%`;

    expenseBar.style.height =
        `${(totalExpense / highestAmount) * 100}%`;
}


/* Search */

searchInput.addEventListener(
    "input",
    updateUI
);


/* Filter */

filterInput.addEventListener(
    "change",
    updateUI
);


/* Dark Mode */

themeBtn.addEventListener("click", () => {

    document.body.classList.toggle("dark");

    themeBtn.textContent =
        document.body.classList.contains("dark")
            ? "☀️"
            : "🌙";
});


/* Initial Load */

updateUI();