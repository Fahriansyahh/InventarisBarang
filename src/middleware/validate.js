const { validationResult } = require('express-validator');

const middlewareCreate=(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('produkCreate', {
      errors: errors.array(),
      old: req.body
    });
  }
  next();
};

const middlewareEdit= (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('produkEdit', {
      errors: errors.array(),
      old: req.body,
  produk:{id:req.params.id} 
    });
  }
  next();
};
module.exports = {middlewareCreate,middlewareEdit}