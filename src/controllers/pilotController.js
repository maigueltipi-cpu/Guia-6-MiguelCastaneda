const pilotService = require('../services/pilotService');

const handleError = (res, error) =>
  res.status(error.status || 500).json({ error: error.message });

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.getAllPilots());
  } catch (error) {
    return handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.getPilotById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await pilotService.registerPilot(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await pilotService.updatePilot(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await pilotService.deletePilot(req.params.id);
    return res.status(200).json({ message: 'Piloto eliminado correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
