const expressionEl = document.getElementById('expression');
const currentEl = document.getElementById('current');

let currentValue = '0';
let previousValue = null;
let operator = null;
let justCalculated = false;

function updateDisplay() {
  currentEl.textContent = currentValue;
  expressionEl.textContent =
    previousValue !== null && operator ? `${previousValue} ${operator}` : '';
}

function inputNumber(digit) {
  if (currentValue === '0' || justCalculated) {
    currentValue = digit;
    justCalculated = false;
  } else {
    currentValue += digit;
  }
}

function inputDecimal() {
  if (justCalculated) {
    currentValue = '0';
    justCalculated = false;
  }
  if (!currentValue.includes('.')) {
    currentValue += '.';
  }
}

function clearAll() {
  currentValue = '0';
  previousValue = null;
  operator = null;
  justCalculated = false;
}

function toggleSign() {
  currentValue = (parseFloat(currentValue) * -1).toString();
}

function applyPercent() {
  currentValue = (parseFloat(currentValue) / 100).toString();
}

async function calculate(num1, num2, op) {
  try {
    const response = await fetch('/api/calculate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ num1, num2, operator: op }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Calculation error');
    }
    return data.result;
  } catch (err) {
    currentEl.textContent = 'Error';
    throw err;
  }
}

async function chooseOperator(nextOperator) {
  if (operator && previousValue !== null && !justCalculated) {
    const result = await calculate(previousValue, currentValue, operator);
    previousValue = result;
  } else {
    previousValue = parseFloat(currentValue);
  }
  operator = nextOperator;
  currentValue = '0';
  justCalculated = false;
  updateDisplay();
}

async function handleEquals() {
  if (operator === null || previousValue === null) return;
  const result = await calculate(previousValue, currentValue, operator);
  currentValue = result.toString();
  previousValue = null;
  operator = null;
  justCalculated = true;
  updateDisplay();
}

document.querySelectorAll('.btn').forEach((button) => {
  button.addEventListener('click', async () => {
    const { number, operator: op, action } = button.dataset;

    if (number !== undefined) {
      inputNumber(number);
      updateDisplay();
      return;
    }

    if (op !== undefined) {
      await chooseOperator(op);
      return;
    }

    switch (action) {
      case 'clear':
        clearAll();
        updateDisplay();
        break;
      case 'sign':
        toggleSign();
        updateDisplay();
        break;
      case 'percent':
        applyPercent();
        updateDisplay();
        break;
      case 'decimal':
        inputDecimal();
        updateDisplay();
        break;
      case 'equals':
        await handleEquals();
        break;
    }
  });
});

updateDisplay();
