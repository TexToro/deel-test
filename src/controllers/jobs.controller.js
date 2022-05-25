
const Op = require("Sequelize").Op;
const { Transaction } = require('sequelize');

module.exports = {
  async getUnpaidJobs(req, res) {
    const profileId = req.profile.id;
    const { Job, Contract } = req.app.get("models");
    const jobs = await Job.findAll({
      include: [
        {
          model: Contract,
          where: {
            status: {
              [Op.not]: "terminated",
            },
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
          },
        },
      ],
      where: {
        paid: null,
      },
    });

    if (!jobs) return res.status(404).end();
    res.json(jobs);
  },

  async payForJob(req, res) {
    const profileId = req.profile.id;
    const userBalance = req.profile.balance;
    const { Job, Contract, Profile } = req.app.get("models");
    const sequelize = req.app.get("sequelize");
    const { jobId } = req.params;

    const job = await Job.findOne({
      where: {
        id: jobId,
      },
      include: {
        model: Contract,
      },
    });

    if (userBalance >= job.price) {
      try {

        await sequelize.transaction({
          isolationLevel: Transaction.ISOLATION_LEVELS.SERIALIZABLE
        }, async (t) => {
          await Profile.increment('balance', { by: job.price, where: { id: job.Contract.ContractorId }, transaction: t});
          await Profile.decrement('balance', { by: job.price, where: { id: profileId }, transaction: t});
        })

      } catch (err) {
        return res.status(500).end()
      }
    } else {
      // error notify about less balance
      return res.status(400).end()
    }

    res.json({success: true});
  },
};
