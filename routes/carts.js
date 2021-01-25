const express = require('express');

const router = express.Router();

const cartRepo = require('../repos/carts');
const productsRepo = require('../repos/products');
const cartShowTemp = require('../views/carts/cartsTemp');

//Add cart item
router.post('/cart/products', async (req, res) => {
	const productId = req.body.productId;

	// which cart to add to
	let cart;
	if (!req.session.cartId) {
		cart = await cartRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		cart = await cartRepo.getOne(req.session.cartId);
	}

	//deal with products
	const existingItem = cart.items.find((item) => item.id === productId);

	if (existingItem) {
		existingItem.quantity++;
	} else {
		cart.items.push({ id: productId, quantity: 1 });
	}

	await cartRepo.update(cart.id, { items: cart.items });

	res.redirect('/cart');
});

// show all items in cart
router.get('/cart', async (req, res) => {
	if (!req.session.cartId) {
		return res.redirect('/');
	}

	const cart = await cartRepo.getOne(req.session.cartId);

	for (let item of cart.items) {
		const product = await productsRepo.getOne(item.id);

		item.product = product;
	}

	res.send(cartShowTemp({ items: cart.items }));
});

// delete item on the cart

router.post('/cart/products/delete', async (req, res) => {
	const itemIdToRemove = req.body.itemId;

	const cart = await cartRepo.getOne(req.session.cartId);

	const items = cart.items.filter((item) => item.id !== itemIdToRemove);

	await cartRepo.update(req.session.cartId, { items });

	res.redirect('/cart');
});

module.exports = router;
