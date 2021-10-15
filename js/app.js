'use strict';

// ----------------solution with jQuery--------------
$(() => {
    const budgetForm = $('#budget-form'),
        budgetInput = $('#budget-input'),
        expenseForm = $('#expense-form'),
        expenseInput = $('#expense-input'),
        amountInput = $('#amount-input'),
        budgetAmount = $('#budget-amount'),
        expenseAmount = $('#expense-amount'),
        balanceAmount = $('#balance-amount'),
        tableContainer = $('.tableContainer'),
        table = $('<table/>'),
        thead = $('<thead/>'),
        tbody = $('<tbody/>'),
        budgetFromStorage = localStorage.getItem('budgetAmount'),
        expenseFromStorage = localStorage.getItem('expenseAmount'),
        balanceFromStorage = localStorage.getItem('balanceAmount'),
        rowsFromStorage = JSON.parse(localStorage.getItem('rowsInStorage'));

    let tableRows = [];

    const addItem = (targetEl, added) => $(targetEl).addClass(added);
    const removeItem = (targetEl, removed) => $(targetEl).removeClass(removed);
    const setItemLS = (key, value) => localStorage.setItem(key, value);

    const changeBalanceColor = function (condition) {
        const balanceDescription = $('#balance');
        if (condition > 0) {
            addItem(balanceDescription, 'showGreen');
            removeItem(balanceDescription, 'showRed');
            removeItem(balanceDescription, 'showBlack');
        } else if (condition === 0) {
            addItem(balanceDescription, 'showBlack');
            removeItem(balanceDescription, 'showRed');
            removeItem(balanceDescription, 'showGreen');
        } else if (condition < 0) {
            addItem(balanceDescription, 'showRed');
            removeItem(balanceDescription, 'showGreen');
            removeItem(balanceDescription, 'showBlack');
        }
    };

    const makeHead = function () {
        const rowHeading = $('<tr/>'),
            thExpense = $('<th/>'),
            thAmount = $('<th/>'),
            thButtons = $('<th/>');

        thExpense.text('Expense Title');
        thAmount.text('Expense Value');

        rowHeading.append(thExpense, thAmount, thButtons);
        thead.append(rowHeading);
        table.append(thead);
        tableContainer.append(table);
    };

    const makeAndManipulateRows = function (expense, amount) {
        const row = $('<tr/>'),
            tdExpense = $('<td/>'),
            tdAmount = $('<td/>'),
            tdButtons = $('<td/>'),
            deleteIcon = $('<i/>'),
            editIcon = $('<i/>');

        tdExpense.text(expense.toUpperCase());
        tdAmount.text(amount);
        tdExpense.addClass('showRed font-weight-bold');
        tdAmount.addClass('showRed font-weight-bold');
        editIcon.addClass('fas fa-edit edit-icon mr-2');
        deleteIcon.addClass('fas fa-trash delete-icon');

        tdButtons.append(editIcon, deleteIcon);
        row.append(tdExpense, tdAmount, tdButtons);
        tbody.append(row);
        table.append(tbody);

        editIcon.on('click', () => {
            row.remove();
            tableRows.splice(row.rowIndex - 1, 1);
            localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

            expenseInput.val(row.find('td:eq(0)').html());
            amountInput.val(row.find('td:eq(1)').html());

            expenseAmount.text(
                parseInt(expenseAmount.text()) - parseInt(tdAmount.text())
            );
            setItemLS('expenseAmount', expenseAmount.text());

            balanceAmount.text(
                parseInt(balanceAmount.text()) + parseInt(tdAmount.text())
            );
            setItemLS('balanceAmount', balanceAmount.text());

            changeBalanceColor(parseInt(balanceAmount.text()));

            if (
                parseInt(budgetAmount.text()) === parseInt(balanceAmount.text())
            )
                thead.remove();
        });

        deleteIcon.on('click', () => {
            row.remove();
            tableRows.splice(row.rowIndex - 1, 1);
            localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

            expenseAmount.text(
                parseInt(expenseAmount.text()) - parseInt(tdAmount.text())
            );
            setItemLS('expenseAmount', expenseAmount.text());

            balanceAmount.text(
                parseInt(balanceAmount.text()) + parseInt(tdAmount.text())
            );
            setItemLS('balanceAmount', balanceAmount.text());

            changeBalanceColor(parseInt(balanceAmount.text()));

            if (
                parseInt(budgetAmount.text()) === parseInt(balanceAmount.text())
            )
                thead.remove();
        });
    };

    if (parseInt(budgetAmount.text()) === parseInt(balanceAmount.text())) {
        expenseForm.on('submit', () => {
            thead.html('');
            makeHead();
        });
    }

    if (budgetFromStorage) budgetAmount.text(parseInt(budgetFromStorage));
    if (expenseFromStorage) expenseAmount.text(parseInt(expenseFromStorage));
    if (balanceFromStorage) balanceAmount.text(parseInt(balanceFromStorage));

    changeBalanceColor(parseInt(balanceFromStorage));

    if (rowsFromStorage) {
        rowsFromStorage.forEach(row =>
            makeAndManipulateRows(row.expense, row.amount)
        );

        makeHead();
        tableRows = rowsFromStorage.slice();
    }

    if (parseInt(budgetAmount.text()) === parseInt(balanceAmount.text()))
        thead.remove();

    budgetForm.on('submit', e => {
        e.preventDefault();
        if (!budgetInput.val() || parseInt(budgetInput.val()) < 0) {
            const budgetFeedback = $('.budget-feedback');

            budgetFeedback.html(
                `<p class='mb-0'>Please enter a value/ Value cannot be negative</p>`
            );
            addItem(budgetFeedback, 'showItem');

            budgetInput.on('focus', () =>
                removeItem(budgetFeedback, 'showItem')
            );
        } else {
            budgetAmount.text(parseInt(budgetInput.val()));
            setItemLS('budgetAmount', budgetAmount.text());

            balanceAmount.text(
                parseInt(budgetAmount.text()) - parseInt(expenseAmount.text())
            );
            setItemLS('balanceAmount', balanceAmount.text());

            changeBalanceColor(balanceAmount.text());
            budgetForm.get(0).reset();
        }
    });

    expenseForm.on('submit', e => {
        e.preventDefault();
        if (
            !expenseInput.val() ||
            !amountInput.val() ||
            parseInt(amountInput.val()) < 0
        ) {
            const expenseFeedback = $('.expense-feedback');

            expenseFeedback.html(
                `<p class='mb-0'> Please fill in the both fields / The value cannot be negative</p>`
            );
            addItem(expenseFeedback, 'showItem');

            expenseInput.on('focus', () =>
                removeItem(expenseFeedback, 'showItem')
            );

            amountInput.on('focus', () =>
                removeItem(expenseFeedback, 'showItem')
            );
        } else {
            expenseAmount.text(
                parseInt(amountInput.val()) + parseInt(expenseAmount.text())
            );
            setItemLS('expenseAmount', expenseAmount.text());

            makeAndManipulateRows(expenseInput.val(), amountInput.val());

            const newRow = {
                expense: expenseInput.val(),
                amount: amountInput.val(),
            };

            tableRows.push(newRow);
            localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

            balanceAmount.text(
                parseInt(budgetAmount.text()) - parseInt(expenseAmount.text())
            );
            setItemLS('balanceAmount', balanceAmount.text());

            changeBalanceColor(parseInt(balanceAmount.text()));
            expenseForm.get(0).reset();
        }
    });
});

///////////////////////////////////////////////////////////////////

// ----------------solution with javaScript--------------
// const budgetForm = document.querySelector('#budget-form'),
//     budgetInput = document.querySelector('#budget-input'),
//     expenseForm = document.querySelector('#expense-form'),
//     expenseInput = document.querySelector('#expense-input'),
//     amountInput = document.querySelector('#amount-input'),
//     budgetAmount = document.querySelector('#budget-amount'),
//     expenseAmount = document.querySelector('#expense-amount'),
//     balanceAmount = document.querySelector('#balance-amount'),
//     tableContainer = document.querySelector('.tableContainer'),
//     table = document.createElement('table'),
//     thead = document.createElement('thead'),
//     tbody = document.createElement('tbody');

// let tableRows = [];

// const addItem = (targetEl, added) => targetEl.classList.add(added);
// const removeItem = (targetEl, removed) => targetEl.classList.remove(removed);
// const setItemLS = (key, value) => localStorage.setItem(key, value);

// const changeBalanceColor = function (condition) {
//     const balanceDescription = document.querySelector('#balance');
//     if (condition > 0) {
//         addItem(balanceDescription, 'showGreen');
//         removeItem(balanceDescription, 'showRed');
//         removeItem(balanceDescription, 'showBlack');
//     } else if (condition === 0) {
//         addItem(balanceDescription, 'showBlack');
//         removeItem(balanceDescription, 'showRed');
//         removeItem(balanceDescription, 'showGreen');
//     } else if (condition < 0) {
//         addItem(balanceDescription, 'showRed');
//         removeItem(balanceDescription, 'showGreen');
//         removeItem(balanceDescription, 'showBlack');
//     }
// };

// const makeHead = function () {
//     const rowHeading = document.createElement('tr'),
//         thExpense = document.createElement('th'),
//         thAmount = document.createElement('th'),
//         thButtons = document.createElement('th');

//     thExpense.textContent = 'Expense Title';
//     thAmount.textContent = 'Expense Value';

//     rowHeading.append(thExpense, thAmount, thButtons);
//     thead.appendChild(rowHeading);
//     table.appendChild(thead);
//     tableContainer.appendChild(table);
// };

// const makeAndManipulateRows = function (expense, amount) {
//     const row = document.createElement('tr'),
//         tdExpense = document.createElement('td'),
//         tdAmount = document.createElement('td'),
//         tdButtons = document.createElement('td'),
//         deleteIcon = document.createElement('i'),
//         editIcon = document.createElement('i');

//     tdExpense.textContent = expense.toUpperCase();
//     tdAmount.textContent = amount;
//     tdExpense.classList.add('showRed', 'font-weight-bold');
//     tdAmount.classList.add('showRed', 'font-weight-bold');
//     editIcon.classList.add('fas', 'fa-edit', 'edit-icon', 'mr-2');
//     deleteIcon.classList.add('fas', 'fa-trash', 'delete-icon');

//     tdButtons.append(editIcon, deleteIcon);
//     row.append(tdExpense, tdAmount, tdButtons);
//     tbody.appendChild(row);
//     table.appendChild(tbody);

//     editIcon.addEventListener('click', () => {
//         row.remove();
//         tableRows.splice(row.rowIndex - 1, 1);
//         localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

//         expenseInput.value = tdExpense.textContent;
//         amountInput.value = tdAmount.textContent;

//         expenseAmount.textContent =
//             +expenseAmount.textContent - +tdAmount.textContent;
//         setItemLS('expenseAmount', expenseAmount.textContent);

//         balanceAmount.textContent =
//             +balanceAmount.textContent + +tdAmount.textContent;
//         setItemLS('balanceAmount', balanceAmount.textContent);

//         changeBalanceColor(+balanceAmount.textContent);

//         if (+budgetAmount.textContent === +balanceAmount.textContent)
//             thead.remove();
//     });

//     deleteIcon.addEventListener('click', () => {
//         row.remove();
//         tableRows.splice(row.rowIndex - 1, 1);
//         localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

//         expenseAmount.textContent =
//             +expenseAmount.textContent - +tdAmount.textContent;
//         setItemLS('expenseAmount', expenseAmount.textContent);

//         balanceAmount.textContent =
//             +balanceAmount.textContent + +tdAmount.textContent;
//         setItemLS('balanceAmount', balanceAmount.textContent);

//         changeBalanceColor(+balanceAmount.textContent);

//         if (+budgetAmount.textContent === +balanceAmount.textContent)
//             thead.remove();
//     });
// };

// if (+budgetAmount.textContent === +balanceAmount.textContent) {
//     expenseForm.addEventListener('submit', () => {
//         thead.innerHTML = '';
//         makeHead();
//     });
// }

// budgetForm.addEventListener('submit', e => {
//     e.preventDefault();
//     if (!budgetInput.value || budgetInput.valueAsNumber < 0) {
//         const budgetFeedback = document.querySelector('.budget-feedback');
//         budgetFeedback.innerHTML = `<p class='mb-0'>Please enter a value/ Value cannot be negative</p>`;
//         addItem(budgetFeedback, 'showItem');
//         budgetInput.addEventListener('focus', () =>
//             removeItem(budgetFeedback, 'showItem')
//         );
//     } else {
//         budgetAmount.textContent = budgetInput.valueAsNumber;
//         setItemLS('budgetAmount', budgetAmount.textContent);

//         balanceAmount.textContent =
//             +budgetAmount.textContent - +expenseAmount.textContent;
//         setItemLS('balanceAmount', balanceAmount.textContent);

//         changeBalanceColor(balanceAmount.textContent);
//         budgetForm.reset();
//     }
// });

// expenseForm.addEventListener('submit', e => {
//     e.preventDefault();
//     if (
//         !expenseInput.value ||
//         !amountInput.value ||
//         amountInput.valueAsNumber < 0
//     ) {
//         const expenseFeedback = document.querySelector('.expense-feedback');
//         expenseFeedback.innerHTML = `<p class='mb-0'>Please fill in the both fields / The value cannot be negative</p>`;
//         addItem(expenseFeedback, 'showItem');

//         expenseInput.addEventListener('focus', () =>
//             removeItem(expenseFeedback, 'showItem')
//         );
//         amountInput.addEventListener('focus', () =>
//             removeItem(expenseFeedback, 'showItem')
//         );
//     } else {
//         expenseAmount.textContent =
//             amountInput.valueAsNumber + +expenseAmount.textContent;
//         setItemLS('expenseAmount', expenseAmount.textContent);

//         makeAndManipulateRows(expenseInput.value, amountInput.value);

//         const newRow = {
//             expense: expenseInput.value,
//             amount: amountInput.value,
//         };

//         tableRows.push(newRow);
//         localStorage.setItem('rowsInStorage', JSON.stringify(tableRows));

//         balanceAmount.textContent =
//             +budgetAmount.textContent - +expenseAmount.textContent;
//         setItemLS('balanceAmount', balanceAmount.textContent);

//         changeBalanceColor(+balanceAmount.textContent);
//         expenseForm.reset();
//     }
// });

// window.addEventListener('load', () => {
//     const budgetFromStorage = localStorage.getItem('budgetAmount'),
//         expenseFromStorage = localStorage.getItem('expenseAmount'),
//         balanceFromStorage = localStorage.getItem('balanceAmount'),
//         rowsFromStorage = JSON.parse(localStorage.getItem('rowsInStorage'));

//     if (budgetFromStorage) budgetAmount.textContent = +budgetFromStorage;
//     if (expenseFromStorage) expenseAmount.textContent = +expenseFromStorage;

//     if (balanceFromStorage) balanceAmount.textContent = +balanceFromStorage;
//     changeBalanceColor(+balanceFromStorage);

//     if (rowsFromStorage) {
//         rowsFromStorage.forEach(row =>
//             makeAndManipulateRows(row.expense, row.amount)
//         );

//         makeHead();
//         tableRows = rowsFromStorage.slice();
//     }

//     if (+budgetAmount.textContent === +balanceAmount.textContent)
//         thead.remove();
// });
