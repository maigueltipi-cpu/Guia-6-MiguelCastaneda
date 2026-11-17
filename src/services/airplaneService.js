const airplaneModel = require('../models/airplaneModel');
const assignmentModel = require('../models/assignmentModel');
const AppError = require('../utils/AppError');

const isText = (v) => typeof v === 'string' && v.trim().length > 0;

const validate = (data, partial = false) => {
  const { modelo, matricula, capacidadMaxima, fabricante } = data;

  if (!partial || modelo !== undefined) {
    if (!isText(modelo)) throw new AppError('El modelo es obligatorio');
  }
  if (!partial || matricula !== undefined) {
    if (!isText(matricula)) throw new AppError('La matrícula es obligatoria');
  }
  if (!partial || capacidadMaxima !== undefined) {
    if (!Number.isInteger(capacidadMaxima) || capacidadMaxima <= 0) {
      throw new AppError('La capacidad máxima debe ser un entero mayor a 0');
    }
  }
  if (!partial || fabricante !== undefined) {
    if (!isText(fabricante)) throw new AppError('El fabricante es obligatorio');
  }
};

const ensureUniquePlate = async (matricula, ignoreId = null) => {
  const duplicated = await airplaneModel.findWhere(
    (a) => a.matricula === matricula && a.id !== ignoreId
  );
  if (duplicated.length) throw new AppError('Ya existe un avión con esa matrícula', 409);
};

const getAllAirplanes = async () => airplaneModel.findAll();

const getAirplaneById = async (id) => {
  const airplane = await airplaneModel.findById(id);
  if (!airplane) throw new AppError('Avión no encontrado', 404);
  return airplane;
};

const registerAirplane = async (data) => {
  validate(data);
  await ensureUniquePlate(data.matricula);
  const { modelo, matricula, capacidadMaxima, fabricante } = data;
  return airplaneModel.save({
    modelo: modelo.trim(),
    matricula: matricula.trim(),
    capacidadMaxima,
    fabricante: fabricante.trim(),
  });
};

const updateAirplane = async (id, data) => {
  await getAirplaneById(id);
  validate(data, true);
  if (data.matricula) await ensureUniquePlate(data.matricula, Number(id));
  const { modelo, matricula, capacidadMaxima, fabricante } = data;
  const changes = Object.fromEntries(
    Object.entries({ modelo, matricula, capacidadMaxima, fabricante }).filter(([, v]) => v !== undefined)
  );
  return airplaneModel.update(id, changes);
};

const deleteAirplane = async (id) => {
  await getAirplaneById(id);
  const assigned = await assignmentModel.findWhere((a) => a.idAvion === Number(id));
  if (assigned.length) {
    throw new AppError('No se puede eliminar: el avión tiene asignaciones registradas', 409);
  }
  return airplaneModel.remove(id);
};

module.exports = { getAllAirplanes, getAirplaneById, registerAirplane, updateAirplane, deleteAirplane };
