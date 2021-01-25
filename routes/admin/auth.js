const express = require('express');

const { handelErrors } = require('../admin/middleware');
const usersRepo = require('../../repos/users');
const signUpTemp = require('../../views/admin/auth/singup');
const signInTemp = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmantion,
	requireEmailExists,
	requireValidPasswordForUser
} = require('./validators');

const router = express.Router(); // to be used in index.js

router.get('/signup', (req, res) => {
	res.send(signUpTemp({ req }));
});

router.post(
	'/signup',
	handelErrors(signUpTemp),
	[ requireEmail, requirePassword, requirePasswordConfirmantion ],
	async (req, res) => {
		//sign up
		const { email, password } = req.body;

		const user = await usersRepo.createUser({ email, password }); // create user

		req.session.userId = user.id; //make cookie

		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out');
});

router.get('/signin', (req, res) => {
	res.send(signInTemp({}));
});

router.post(
	'/signin',
	[ requireEmailExists, requireValidPasswordForUser ],
	handelErrors(signInTemp),
	async (req, res) => {
		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;

		res.redirect('/admin/products');
	}
);

module.exports = router;
