const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRepo extends Repository {
	async createUser(attrs) {
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex'); // generate salt

		const buf = await scrypt(attrs.password, salt, 64); // add salt

		const records = await this.getAll();

		const record = {
			...attrs,
			password: `${buf.toString('hex')}.${salt}` //store hashed
		};

		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePass(stored, supplied) {
		const result = stored.split('.');
		const [ hashed, salt ] = result;

		const hashSuppliedBuff = await scrypt(supplied, salt, 64);

		return hashed === hashSuppliedBuff.toString('hex');
	}
}

module.exports = new UsersRepo('users.json');
