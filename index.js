const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const express = require('express');

const authRouter = require('./routes/admin/auth');
const adminProductsRouter = require('./routes/admin/products');
const userProductsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
	cookieSession({
		keys: [ 'jfdslkfjdslk' ]
	})
);

app.use(authRouter);
app.use(adminProductsRouter);
app.use(userProductsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
	console.log('Up And Running At Port 3000 Link:http://localhost:3000');
});
