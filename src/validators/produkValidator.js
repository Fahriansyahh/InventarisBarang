const { body } = require('express-validator');
const Produk = require('../models/Produk');

const validateCreate = [
  body('nama')
    .notEmpty().withMessage('Nama produk wajib diisi')
    .custom(async (value) => {
      const exist = await Produk.findOneByName(value);
      if (exist) throw new Error('Nama produk sudah digunakan');
    }),
     body('harga').isNumeric().withMessage('Harga harus berupa angka.'),
  body('stok').isInt({ min: 0 }).withMessage('Stok harus berupa angka bulat positif.')
];

const validateUpdate = [
  body('nama')
    .notEmpty().withMessage('Nama produk wajib diisi')
    .custom(async (value, { req }) => {
      const exist = await Produk.findOneByName(value);
      if (exist && exist.id !== parseInt(req.params.id, 10)) {
        throw new Error('Nama produk sudah digunakan');
      }
    }),
     body('harga').isNumeric().withMessage('Harga harus berupa angka.'),
  body('stok').isInt({ min: 0 }).withMessage('Stok harus berupa angka bulat positif.')
];

module.exports = { validateCreate, validateUpdate };
