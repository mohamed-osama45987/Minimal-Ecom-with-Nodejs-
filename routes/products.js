const express = require('express');
const productsRepo = require('../repos/products');
const productsList = require('../views/products/index');

const router = express.Router();

router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsList({products}));
});

module.exports = router;
