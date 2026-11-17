const airplaneService = require('../services/airplaneService');

const handleError = (res, error) =>
  res.status(error.status || 500).json({ error: error.message });

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await airplaneService.getAllAirplanes());
  } catch (error) {
    return handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await airplaneService.getAirplaneById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await airplaneService.registerAirplane(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await airplaneService.updateAirplane(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await airplaneService.deleteAirplane(req.params.id);
    return res.status(200).json({ message: 'Avión eliminado correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
