const Repository = require('./repository');

class ProductRepo extends Repository {}

module.exports = new ProductRepo('products.json');
 