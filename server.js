const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/calculate', (req, res) => {
  const { num1, num2, operator } = req.body;
  const a = Number(num1);
  const b = Number(num2);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    return res.status(400).json({ error: 'Invalid numbers' });
  }

  let result;
  switch (operator) {
    case '+':
      result = a + b;
      break;
    case '-':
      result = a - b;
      break;
    case '*':
      result = a * b;
      break;
    case '/':
      if (b === 0) {
        return res.status(400).json({ error: 'Cannot divide by zero' });
      }
      result = a / b;
      break;
    default:
      return res.status(400).json({ error: 'Invalid operator' });
  }

  res.json({ result });
});

app.listen(PORT, () => {
  console.log(`Calculator app running at http://localhost:${PORT}`);
});
