const express = require('express');
const multer = require('multer');

const { handelErrors, requireAuth } = require('../admin/middleware');
const productsRepo = require('../../repos/products');
const addNewProductTemp = require('../../views/admin/products/addProduct');
const productsIndexTemp = require('../../views/admin/products/index');
const productsEditTemp = require('../../views/admin/products/edit');
const { requireTitle, requirePrice } = require('./validators');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

//display All Availabel products
router.get('/admin/products', requireAuth, async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(productsIndexTemp({ products }));
});

// add new products display page
router.get('/admin/products/new', requireAuth, (req, res) => {
	res.send(addNewProductTemp({}));
});

// Must be in the same organized way of middlewares to make a new product
router.post(
	'/admin/products/new',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handelErrors(addNewProductTemp),
	async (req, res) => {
		const image = req.file.buffer.toString('base64');

		const { title, price } = req.body;

		await productsRepo.create({ title, price, image });

		res.redirect('/admin/products');
	}
);

//edit route handler
router.get('/admin/products/:id/edit', requireAuth, async (req, res) => {
	const product = await productsRepo.getOne(req.params.id);

	if (!product) {
		return res.send('Product not found');
	}
	res.send(productsEditTemp({ product }));
});

router.post(
	'/admin/products/:id/edit',
	requireAuth,
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handelErrors(productsEditTemp, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;

		if (req.file) {
			changes.image = req.file.buffer.toString('base64');
		}

		try {
			await productsRepo.update(req.params.id, changes);
		} catch (err) {
			return res.send('Colud not find item');
		}

		res.redirect('/admin/products');
	}
);

// Delete route handler

router.post('/admin/products/:id/delete', requireAuth, async (req, res) => {
	await productsRepo.delete(req.params.id);
	res.redirect('/admin/products');
});

module.exports = router;
