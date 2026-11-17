const { Router } = require('express');
const controller = require('../controllers/airplaneController');

const router = Router();

router.get('/aviones', controller.getAll);
router.get('/aviones/:id', controller.getById);
router.post('/aviones', controller.create);
router.put('/aviones/:id', controller.update);
router.delete('/aviones/:id', controller.remove);

module.exports = router;
