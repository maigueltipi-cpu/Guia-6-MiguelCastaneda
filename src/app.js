const express = require('express');
const pilotRoutes = require('./routes/pilotRoutes');
const airplaneRoutes = require('./routes/airplaneRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', pilotRoutes);
app.use('/api', airplaneRoutes);
app.use('/api', assignmentRoutes);

app.use((req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

app.use((err, req, res, next) => {
  // Cubre, por ejemplo, JSON mal formado en el body.
  res.status(err.status || 500).json({ error: err.message });
});

if (require.main === module) {
  app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
}

module.exports = app;
