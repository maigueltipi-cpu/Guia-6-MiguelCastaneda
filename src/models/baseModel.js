const fs = require('fs').promises;
const path = require('path');

const createModel = (fileName, idField) => {
  const filePath = path.join(__dirname, '..', 'data', fileName);

  const readAll = async () => {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return content.trim() ? JSON.parse(content) : [];
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      throw error;
    }
  };

  const writeAll = async (items) => {
    await fs.writeFile(filePath, JSON.stringify(items, null, 2), 'utf-8');
  };

  const findAll = async () => readAll();

  const findById = async (id) => {
    const items = await readAll();
    return items.find((item) => item[idField] === Number(id)) || null;
  };

  const findWhere = async (predicate) => {
    const items = await readAll();
    return items.filter(predicate);
  };

  const save = async (data) => {
    const items = await readAll();
    const nextId = items.reduce((max, item) => Math.max(max, item[idField]), 0) + 1;
    const newItem = { [idField]: nextId, ...data };
    items.push(newItem);
    await writeAll(items);
    return newItem;
  };

  const update = async (id, data) => {
    const items = await readAll();
    const index = items.findIndex((item) => item[idField] === Number(id));
    if (index === -1) return null;
    items[index] = { ...items[index], ...data, [idField]: items[index][idField] };
    await writeAll(items);
    return items[index];
  };

  const remove = async (id) => {
    const items = await readAll();
    const index = items.findIndex((item) => item[idField] === Number(id));
    if (index === -1) return null;
    const [removed] = items.splice(index, 1);
    await writeAll(items);
    return removed;
  };

  return { findAll, findById, findWhere, save, update, remove };
};

module.exports = createModel;
