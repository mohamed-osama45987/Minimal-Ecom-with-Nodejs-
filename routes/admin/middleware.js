const { validationResult } = require('express-validator');

module.exports = {
	handelErrors(templateFunc, datacallback) {
		return async (req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				let data = {};

				if (datacallback) {
					data = await datacallback(req);
				}

				return res.send(templateFunc({ errors, ...data }));
			}

			next();
		};
	},

	requireAuth(req, res, next) {
		if (!req.session.userId) {
			return res.redirect('/signin');
		}
		next();
	}
};
