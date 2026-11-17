const { Router } = require('express');
const controller = require('../controllers/assignmentController');

const router = Router();

router.get('/asignaciones', controller.getAll);
router.get('/asignaciones/:id', controller.getById);
router.post('/asignaciones', controller.create);
router.put('/asignaciones/:id', controller.update);
router.delete('/asignaciones/:id', controller.remove);

module.exports = router;
