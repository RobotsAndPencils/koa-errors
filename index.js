const blueprint = require('@polyn/blueprint')
const immutable = require('@polyn/immutable')
const { e500 } = require('./src/500')({ blueprint, immutable })

module.exports = { e500 }
