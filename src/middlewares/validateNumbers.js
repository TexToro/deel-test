const validator = require("validator");

const validateNumbers = async (req, res, next) => {
    const { limit } = req.query;

    if (limit && !validator.isNumeric(limit, {no_symbols: true})) {
      return res.status(400).end();
    }
   
    next()
}
module.exports = {validateNumbers}