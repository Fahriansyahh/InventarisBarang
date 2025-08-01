const express = require('express');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser')

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())
// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(expressLayouts);
app.set('layout', 'layout'); // Nama file layout.ejs

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Routing
const pembelianRouter = require('./src/routes/pembelianRoutes');
const produkRoutes = require('./src/routes/produkRoutes');
const dashboardRoutes=require('./src/routes/dashboardRoutes')
app.use('/', pembelianRouter);
app.use('/',produkRoutes);
app.use('/',dashboardRoutes);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
