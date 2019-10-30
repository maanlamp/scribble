"use strict";

module.exports = class Tuple {
	constructor (values = [], transformer = values => values) {
		Object.assign(this, values.slice(), { ...transformer(values) });
	}

	*[Symbol.iterator]() {
		const values = Object.entries(this)
			.filter(entry => parseInt(entry[0]) >= 0)
			.map(entry => entry[1]);

		for (const value of values)
			yield value;
	}
}