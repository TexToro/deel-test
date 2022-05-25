const Op = require("Sequelize").Op;
const { QueryTypes } = require("sequelize");

module.exports = {
  async getBestClients(req, res) {
    const sequelize = req.app.get("sequelize");
    const { start, end, limit = 2 } = req.query;

    const rawQuery = `SELECT p.id, p.firstName || ' ' || p.lastName as fullName,  sum(j.price) as paid from "profiles" AS p
    LEFT JOIN contracts AS c on p.id = c.ClientId
    LEFT JOIN jobs AS j on j.ContractId = c.id
    WHERE c.status != 'terminated' AND j.paid = true AND paymentDate >= '${start}' and paymentDate <= '${end}' 
    GROUP BY p.id 
    ORDER by paid DESC
    LIMIT ${limit}`;

    const result = await sequelize.query(rawQuery, {
      type: QueryTypes.SELECT,
    });

    res.json(result);
  },

  async getBestProfession(req, res) {
    const sequelize = req.app.get("sequelize");
    const { start, end } = req.query;

    const rawQuery = `SELECT c.id, sum(j.price) AS total FROM jobs AS j
    LEFT JOIN contracts AS c ON j.ContractId = c.id WHERE c.status != 'terminated' AND j.paid = true AND paymentDate >= '${start}' and paymentDate <= '${end}' 
    GROUP BY c.id ORDER BY total DESC LIMIT 1`;

    const result = await sequelize.query(rawQuery, {
      type: QueryTypes.SELECT,
    });

    res.json(result);
  },
};
