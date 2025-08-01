const express = require('express');
const router = express.Router();
const controller = require('../controllers/pembelianController');

router.get('/pembelian', controller.show);
router.get('/pembelian/create', controller.index);
router.get('/pembelian/download', controller.downloadCSV);
router.post('/pembelian/store', controller.store);
router.post('/pembelian/delete/:id', controller.destroy);
module.exports = router;
