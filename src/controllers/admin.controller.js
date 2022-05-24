const Op = require("Sequelize").Op;
const { QueryTypes } = require("sequelize");
const validator = require("validator");

module.exports = {
  async getBestProfession(req, res) {
    const sequelize = req.app.get("sequelize");

    const { start, end } = req.query;

    if (!validator.isDate(start) || !validator.isDate(end)) {
      return res.status(400).end();
    }

    const rawQuery = `SELECT c.id, sum(j.price) AS total FROM jobs AS j
    LEFT JOIN contracts AS c ON j.ContractId = c.id WHERE j.paid = true AND paymentDate >= '${start}' and paymentDate <= '${end}' 
    GROUP BY c.id ORDER BY total DESC LIMIT 1`;

    const result = await sequelize.query(rawQuery, {
      type: QueryTypes.SELECT,
    });

    res.json(result);
  },
};
