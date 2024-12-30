// DOM Elements
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const transactionList = document.getElementById('transaction-list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const transactionType = document.getElementById('transaction-type');

// Transactions Array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Functions
function addTransaction(e) {
  e.preventDefault();

  const transaction = {
    id: generateID(),
    text: text.value,
    amount: transactionType.value === 'income' ? +amount.value : -amount.value,  // Adjust amount based on type
  };

  transactions.push(transaction);
  updateLocalStorage();
  renderTransactions();
  updateBalance();

  text.value = '';
  amount.value = '';
}

function generateID() {
  return Math.floor(Math.random() * 100000000);
}

function deleteTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  renderTransactions();
  updateBalance();
}

function editTransaction(id) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  text.value = transaction.text;
  amount.value = Math.abs(transaction.amount);  // Show the amount without the sign
  transactionType.value = transaction.amount > 0 ? 'income' : 'expense';  // Set select to income or expense

  deleteTransaction(id);  // Remove the old transaction to prevent duplication
}

function updateBalance() {
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
  const income = amounts
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  const expense = (
    amounts
      .filter((item) => item < 0)
      .reduce((acc, item) => (acc += item), 0) * -1
  ).toFixed(2);

  balanceEl.textContent = `₹${total}`;
  incomeEl.textContent = `₹${income}`;
  expenseEl.textContent = `₹${expense}`;
}

function renderTransactions() {
  transactionList.innerHTML = '';

  transactions.forEach((transaction) => {
    const li = document.createElement('li');
    li.classList.add(transaction.amount > 0 ? 'income' : 'expense');
    li.innerHTML = `
      ${transaction.text} <span>${transaction.amount > 0 ? '+' : ''}${transaction.amount}</span>
      <button class="delete-btn" onclick="deleteTransaction(${transaction.id})">x</button>
      <button class="edit-btn" onclick="editTransaction(${transaction.id})">Edit</button>
    `;
    transactionList.appendChild(li);
  });
}

function updateLocalStorage() {
  localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Event Listeners
form.addEventListener('submit', addTransaction);

// Initialize App
function init() {
  renderTransactions();
  updateBalance();
}

init();

// DOM Elements
const printBtn = document.getElementById('print-btn');

// Event Listeners
printBtn.addEventListener('click', printHistory);

// Function to trigger print dialog
function printHistory() {
  // Open a new window to handle the print view
  const printWindow = window.open('', '', 'height=600,width=800');
  
  // Write the styles and content to the print window
  printWindow.document.write('<html><head><title>Transaction History</title>');
  
  // Include your existing CSS styles in the print window, including border color for income and expense
  printWindow.document.write('<style>');
  printWindow.document.write(`
    body {
      font-family: Arial, Sans-Serif;
      margin: 0;
      padding: 20px;
    }

    h1 {
      text-align: center;
    }

    .balance {
      text-align: center;
      margin-bottom: 20px;
    }

    .income-expense {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
    }

    .money {
      font-size: 18px;
    }

    .positive {
      color: green;
    }

    .negative {
      color: red;
    }

    ul {
      list-style-type: none;
      padding: 0;
    }

    li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #f4f4f4;
      padding: 10px;
      margin: 5px 0;
      border-left: 5px solid;
    }

    .income {
      border-color: green; /* Green border for income transactions */
    }

    .expense {
      border-color: red; /* Red border for expense transactions */
    }

    button {
      padding: 5px 10px;
      font-size: 14px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    button.delete-btn {
      background-color: #dc3545;
      color: white;
    }

    button.delete-btn:hover {
      background-color: #c82333;
    }

    button.edit-btn {
      background-color: #28a745;
      color: white;
    }

    button.edit-btn:hover {
      background-color: #218838;
    }

    #print-btn {
      display: none;
    }
  `);
  printWindow.document.write('</style>');
  
  printWindow.document.write('</head><body>');
  
  // Add the balance section to the print view
  printWindow.document.write(`
    <div class="balance">
      <h3>Your Balance</h3>
      <h2>${balanceEl.textContent}</h2>
    </div>
    <div class="income-expense">
      <div>
        <h3>Income</h3>
        <p class="money positive">${incomeEl.textContent}</p>
      </div>
      <div>
        <h3>Expense</h3>
        <p class="money negative">${expenseEl.textContent}</p>
      </div>
    </div>
  `);

  // Add transaction history
  printWindow.document.write('<h2>Transaction History</h2>');
  printWindow.document.write('<ul>');
  
  // Loop through the transactions and add them to the print view
  transactions.forEach((transaction) => {
    const transactionClass = transaction.amount > 0 ? 'income' : 'expense';
    printWindow.document.write(`
      <li class="${transactionClass}">
        ${transaction.text} <span>${transaction.amount > 0 ? '+' : ''}${transaction.amount}</span>
      </li>
    `);
  });

  printWindow.document.write('</ul>');
  printWindow.document.write('</body></html>');
  printWindow.document.close(); // Close the document to allow printing

  // Trigger the print dialog
  printWindow.print();
}