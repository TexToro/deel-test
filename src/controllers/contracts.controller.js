const Op = require("Sequelize").Op;

module.exports = {
  async getContactById(req, res) {
    const profileId = req.profile.id;
    const { Contract } = req.app.get("models");
    const { id } = req.params;
    const contract = await Contract.findOne({
      where: {
        id,
        [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
      },
    });

    if (!contract) return res.status(404).end();
    res.json(contract);
  },

  async getUserContacts(req, res) {
    const profileId = req.profile.id;
    const { Contract } = req.app.get("models");
    const contracts = await Contract.findAll({
        where: {
            status: {
                [Op.not]: 'terminated'
            },
            [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }],
        }
    });
    res.json(contracts);
  },
};
