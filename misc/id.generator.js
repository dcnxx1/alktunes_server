const ULID = require('ulid')

const generateId = () => ULID.ulid()


module.exports = generateId