const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));

// The required demo credentials
const DEMO_USER = {
  email: 'hire-me@anshumat.org',
  password: 'HireMe@2025!'
};

// Login page route
app.get('/', (req, res) => {
  res.render('login', { error: null });
});

// Login handling route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === DEMO_USER.email && password === DEMO_USER.password) {
    res.render('welcome');
  } else {
    res.render('login', { error: 'Invalid credentials. Please try again.' });
  }
});

// Health check route for the load balancer
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
