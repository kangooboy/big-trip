const calculatorContainer = document.querySelector('.calculator-container');
const editContainer = document.querySelector('.edit-bank-container');
const editButton = document.querySelector('button[name = edit]');
const calculatorButton = document.querySelector('button[name = calculator]');
const fragment = document.createDocumentFragment();
const interestRate = document.querySelector('.rate');
const maxLoan = document.querySelector('.maxloan');
const minPayment = document.querySelector('.minpayment');
const loanTerm = document.querySelector('.term');
const deleteButton = document.querySelector('input[name = delete]');
const resetButton = document.querySelector('input[name = reset]');
const calculateButton = document.querySelector('input[name = calculate]');
const editForm = document.querySelector('.edit-form');
const calculatorForm = document.querySelector('.calculator-form');
const initialLoan = document.querySelector('.initial-loan');
const downPayment = document.querySelector('.down-payment');
const monthlyMortgage = document.querySelector('#monthly-mortgage');
const mortgageContainer = document.querySelector('.monthly-mortgage');
const mortgageLegend = document.querySelector('.mortgage-legend');
const editLegend = document.querySelector('.edit-legend');
const bankList = document.querySelector('.bank-list');
const bankListEdit = bankList.querySelector('#banks');
const bank = bankList.querySelector('.bank-name');

const GET_BANKS = [
  {
    name: 'Alfa', rate: 10, maxloan: 300000, minpayment: 0.2, term: 36,
  },
  {
    name: 'Beta', rate: 20, maxloan: 400000, minpayment: 0.3, term: 24,
  },
  {
    name: 'Zen', rate: 30, maxloan: 500000, minpayment: 0.4, term: 12,
  },
];

const banks = JSON.parse(localStorage.getItem('banks')) || GET_BANKS;

function onEditButtonClick() {
  calculatorContainer.classList.add('hidden');
  editContainer.classList.remove('hidden');
  const editBankList = document.querySelector('.bank-list');
  bankList.remove();
  editLegend.insertAdjacentElement('afterend', editBankList);
  editButton.removeEventListener('click', onEditButtonClick);
  calculatorButton.addEventListener('click', onCalculatorButtonClick);
}

function onCalculatorButtonClick() {
  editContainer.classList.add('hidden');
  calculatorContainer.classList.remove('hidden');
  const calculatorBankList = document.querySelector('.bank-list');
  bankList.remove();
  mortgageLegend.insertAdjacentElement('afterend', calculatorBankList);
  calculatorButton.removeEventListener('click', onCalculatorButtonClick);
  editButton.addEventListener('click', onEditButtonClick);
}

const getBanks = () => {
  localStorage.setItem('banks', JSON.stringify(banks));
};

function renderBanks() {
  banks.forEach((item) => {
    const element = document.createElement('option');
    element.setAttribute('value', item.name);
    element.textContent = item.name;
    fragment.append(element);
  });
  bankListEdit.append(fragment);
}

function setValue(item) {
  bank.value = item.name;
  interestRate.value = item.rate;
  maxLoan.value = item.maxloan;
  minPayment.value = item.maxloan * item.minpayment;
  loanTerm.value = item.term;
}

function onEditFormSubmit(evt) {
  evt.preventDefault();
  for (let i = 0; i < banks.length; i++) {
    if (banks[i].name === bank.value) {
      banks[i].rate = interestRate.value;
      banks[i].maxloan = maxLoan.value; 
      banks[i].minpayment = minPayment.value / maxLoan.value;
      banks[i].term = loanTerm.value;
      banks.splice(i, 1, banks[i]);
    }
  }
  if (!banks.some((el) => el.name === bank.value)) {
    const newBank = {
      name: bank.value, 
      rate: interestRate.value, 
      maxloan: maxLoan.value, 
      minpayment: minPayment.value / maxLoan.value, 
      term: loanTerm.value
    };
    banks.push(newBank);
  }
  getBanks();
  bankListEdit.innerHTML = '';
  bank.value = '';
  renderBanks();
  this.reset();
}

const onCalculateFormSubmit = (evt) => {
  evt.preventDefault();
  const loan = Number(initialLoan.value);
  const term = Number(loanTerm.value);
  const payment = Number(downPayment.value);
  let rate = Number(interestRate.value);
  rate = (rate / 12) / 100;
  const mortgageAmount = (loan - payment) * ((rate * Math.pow((1 + rate), term)) / ((Math.pow((1 + rate), term) - 1)));

  if (loan > Number(maxLoan.value) || payment < Number(minPayment.value)) {
    const error = document.createElement('div');
    error.textContent = 'choose another bank';
    error.style.color = '#FF0000';
    mortgageContainer.after(error);
    calculateButton.disabled = true;
    setTimeout(() => {
      resetButton.click();
      editForm.reset();
      error.remove();
      calculateButton.disabled = false;
    }, 2200);
    return;
  }
  return monthlyMortgage.value = mortgageAmount.toFixed(2);
};

getBanks();
renderBanks();

bank.addEventListener('change', (evt) => {
  banks.forEach((item) => {
    if (evt.target.value === item.name) {
      setValue(item);
    }
  });
});

editButton.addEventListener('click', onEditButtonClick);
calculatorForm.addEventListener('submit', onCalculateFormSubmit);
editForm.addEventListener('submit', onEditFormSubmit);

deleteButton.addEventListener('click', () => {
  banks.forEach((item, i) => {
    if (bank.value === item.name) {
      banks.splice(i, 1);
      bankListEdit.removeChild(bankListEdit.children[i]);
      bank.value = '';
      getBanks();
    }
  });
});