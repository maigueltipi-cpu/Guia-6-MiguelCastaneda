const assignmentModel = require('../models/assignmentModel');
const pilotModel = require('../models/pilotModel');
const airplaneModel = require('../models/airplaneModel');
const AppError = require('../utils/AppError');

const isValidDate = (value) =>
  typeof value === 'string' && /^\d{4}-\d{2}-\d{2}/.test(value) && !Number.isNaN(Date.parse(value));

const validateFields = (data, partial = false) => {
  const { idPiloto, idAvion, fechaVuelo, rutaAsignada } = data;
  if (!partial || idPiloto !== undefined) {
    if (!Number.isInteger(idPiloto)) throw new AppError('idPiloto es obligatorio y debe ser numérico');
  }
  if (!partial || idAvion !== undefined) {
    if (!Number.isInteger(idAvion)) throw new AppError('idAvion es obligatorio y debe ser numérico');
  }
  if (!partial || fechaVuelo !== undefined) {
    if (!isValidDate(fechaVuelo)) throw new AppError('fechaVuelo es obligatoria con formato AAAA-MM-DD');
  }
  if (!partial || rutaAsignada !== undefined) {
    if (typeof rutaAsignada !== 'string' || !rutaAsignada.trim()) throw new AppError('rutaAsignada es obligatoria');
  }
};

// Validaciones relacionales: consultan los modelos de pilotos y aviones.
const validateRelations = async ({ idPiloto, idAvion }) => {
  if (idPiloto !== undefined) {
    const pilot = await pilotModel.findById(idPiloto);
    if (!pilot) throw new AppError(`El piloto con id ${idPiloto} no existe`, 404);
    if (pilot.estado !== 'activo') throw new AppError('El piloto no está activo y no puede ser asignado', 409);
  }
  if (idAvion !== undefined) {
    const airplane = await airplaneModel.findById(idAvion);
    if (!airplane) throw new AppError(`El avión con id ${idAvion} no existe`, 404);
  }
};

// Un piloto o un avión no pueden tener dos asignaciones el mismo día.
const ensureNoConflict = async ({ idPiloto, idAvion, fechaVuelo }, ignoreId = null) => {
  const day = fechaVuelo.slice(0, 10);
  const conflicts = await assignmentModel.findWhere(
    (a) =>
      a.idAsignacion !== ignoreId &&
      a.fechaVuelo.slice(0, 10) === day &&
      (a.idPiloto === idPiloto || a.idAvion === idAvion)
  );
  if (conflicts.length) {
    throw new AppError('Conflicto: el piloto o el avión ya tienen una asignación en esa fecha', 409);
  }
};

const getAllAssignments = async () => assignmentModel.findAll();

const getAssignmentById = async (id) => {
  const assignment = await assignmentModel.findById(id);
  if (!assignment) throw new AppError('Asignación no encontrada', 404);
  return assignment;
};

const registerAssignment = async (data) => {
  validateFields(data);
  await validateRelations(data);
  await ensureNoConflict(data);
  const { idPiloto, idAvion, fechaVuelo, rutaAsignada } = data;
  return assignmentModel.save({ idPiloto, idAvion, fechaVuelo, rutaAsignada: rutaAsignada.trim() });
};

const updateAssignment = async (id, data) => {
  const current = await getAssignmentById(id);
  validateFields(data, true);
  await validateRelations(data);
  const merged = { ...current, ...data };
  await ensureNoConflict(merged, Number(id));
  const { idPiloto, idAvion, fechaVuelo, rutaAsignada } = data;
  const changes = Object.fromEntries(
    Object.entries({ idPiloto, idAvion, fechaVuelo, rutaAsignada }).filter(([, v]) => v !== undefined)
  );
  return assignmentModel.update(id, changes);
};

const deleteAssignment = async (id) => {
  await getAssignmentById(id);
  return assignmentModel.remove(id);
};

module.exports = {
  getAllAssignments,
  getAssignmentById,
  registerAssignment,
  updateAssignment,
  deleteAssignment,
};
