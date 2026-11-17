const assignmentService = require('../services/assignmentService');

const handleError = (res, error) =>
  res.status(error.status || 500).json({ error: error.message });

const getAll = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.getAllAssignments());
  } catch (error) {
    return handleError(res, error);
  }
};

const getById = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.getAssignmentById(req.params.id));
  } catch (error) {
    return handleError(res, error);
  }
};

const create = async (req, res) => {
  try {
    return res.status(201).json(await assignmentService.registerAssignment(req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const update = async (req, res) => {
  try {
    return res.status(200).json(await assignmentService.updateAssignment(req.params.id, req.body));
  } catch (error) {
    return handleError(res, error);
  }
};

const remove = async (req, res) => {
  try {
    await assignmentService.deleteAssignment(req.params.id);
    return res.status(200).json({ message: 'Asignación eliminado correctamente' });
  } catch (error) {
    return handleError(res, error);
  }
};

module.exports = { getAll, getById, create, update, remove };
