const validator = require("validator");

const validateDates = async (req, res, next) => {
    const { start, end } = req.query;

    if (!validator.isDate(start) || !validator.isDate(end)) {
      return res.status(400).end();
    }
   
    next()
}
module.exports = {validateDates}