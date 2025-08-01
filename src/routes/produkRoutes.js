const express = require('express');
const router = express.Router();
const produkController = require('../controllers/produkController');
const { validateCreate,validateUpdate} = require('../validators/produkValidator');
const {middlewareCreate,middlewareEdit} = require('../middleware/validate');

router.get('/produk', produkController.index);
router.get('/produk/create', produkController.create);
router.post('/produk/store',validateCreate,middlewareCreate ,produkController.store);
router.get('/produk/edit/:id', produkController.edit);

// Proses update produk (pakai PUT dengan validasi)
router.post('/produk/update/:id', validateUpdate, middlewareEdit, produkController.update);
router.post('/produk/delete/:id', produkController.destroy);

module.exports = router;
