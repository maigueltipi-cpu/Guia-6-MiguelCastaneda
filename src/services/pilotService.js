const pilotModel = require('../models/pilotModel');
const assignmentModel = require('../models/assignmentModel');
const AppError = require('../utils/AppError');

const ESTADOS = ['activo', 'inactivo', 'suspendido'];

const validate = (data, partial = false) => {
  const { nombre, licencia, horasVuelo, estado } = data;
  if (!partial || nombre !== undefined) {
    if (!nombre || typeof nombre !== 'string' || !nombre.trim()) throw new AppError('El nombre es obligatorio');
  }
  if (!partial || licencia !== undefined) {
    if (!licencia || typeof licencia !== 'string' || !licencia.trim()) throw new AppError('La licencia es obligatoria');
  }
  if (!partial || horasVuelo !== undefined) {
    if (typeof horasVuelo !== 'number' || horasVuelo < 0) throw new AppError('Las horas de vuelo deben ser un número mayor o igual a 0');
  }
  if (!partial || estado !== undefined) {
    if (!ESTADOS.includes(estado)) throw new AppError(`El estado debe ser uno de: ${ESTADOS.join(', ')}`);
  }
};

const ensureUniqueLicense = async (licencia, ignoreId = null) => {
  const duplicated = await pilotModel.findWhere(
    (p) => p.licencia === licencia && p.id !== ignoreId
  );
  if (duplicated.length) throw new AppError('Ya existe un piloto con esa licencia', 409);
};

const getAllPilots = async () => pilotModel.findAll();

const getPilotById = async (id) => {
  const pilot = await pilotModel.findById(id);
  if (!pilot) throw new AppError('Piloto no encontrado', 404);
  return pilot;
};

const registerPilot = async (pilotData) => {
  validate(pilotData);
  await ensureUniqueLicense(pilotData.licencia);
  const { nombre, licencia, horasVuelo, estado } = pilotData;
  return pilotModel.save({ nombre: nombre.trim(), licencia: licencia.trim(), horasVuelo, estado });
};

const updatePilot = async (id, pilotData) => {
  await getPilotById(id);
  validate(pilotData, true);
  if (pilotData.licencia) await ensureUniqueLicense(pilotData.licencia, Number(id));
  const { nombre, licencia, horasVuelo, estado } = pilotData;
  const changes = Object.fromEntries(
    Object.entries({ nombre, licencia, horasVuelo, estado }).filter(([, v]) => v !== undefined)
  );
  return pilotModel.update(id, changes);
};

const deletePilot = async (id) => {
  await getPilotById(id);
  const assigned = await assignmentModel.findWhere((a) => a.idPiloto === Number(id));
  if (assigned.length) {
    throw new AppError('No se puede eliminar: el piloto tiene asignaciones registradas', 409);
  }
  return pilotModel.remove(id);
};

module.exports = { getAllPilots, getPilotById, registerPilot, updatePilot, deletePilot };
