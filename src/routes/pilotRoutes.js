const { Router } = require('express');
const controller = require('../controllers/pilotController');

const router = Router();

router.get('/pilotos', controller.getAll);
router.get('/pilotos/:id', controller.getById);
router.post('/pilotos', controller.create);
router.put('/pilotos/:id', controller.update);
router.delete('/pilotos/:id', controller.remove);

module.exports = router;
