const Op = require("Sequelize").Op;
const { Transaction } = require('sequelize');

module.exports = {
  async depositToClient(req, res) {
    const { Job, Contract, Profile } = req.app.get("models");
    const sequelize = req.app.get("sequelize");

    const { userId } = req.params;

    if (!req.body.deposit) {
      // validation error
      return res.status(400).end();
    }

    const t = await sequelize.transaction({
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    });

    try {
      const totalJobsToPay = await Profile.findOne({
        attributes: [[sequelize.fn("sum", sequelize.col("price")), "total"]],
        where: {
          id: userId,
        },
        include: {
          model: Contract,
          as: "Client",
          where: {
            status: {
              [Op.not]: "terminated",
            },
          },
          include: {
            model: Job,
            where: {
              paid: null,
            },
          },
        },
        raw: true,
        transaction: t
      });

      const allowedLimit = (100 * req.body.deposit) / totalJobsToPay.total;
      if (allowedLimit > 25) {
        await t.rollback();
        // validation error
        return res.status(400).end();
      }

      await Profile.increment('balance', { by: req.body.deposit, where: { id: userId }, transaction: t});

      await t.commit();

      return res.json({success: true});
    } catch (e) {
      await t.rollback();
      return res.status(500).end();
    }
  },
};
