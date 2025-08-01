const Produk = require('../models/Produk');
const { validationResult } = require('express-validator');
module.exports = {
  index: (req, res) => {

    const search = req.query.search || '';
    if(search){
    Produk.search(search, (err, results) => {
    if (err) throw err;
    res.render('produk', { produk: results, search }); // ← kirim 'search' ke view
    });
    }else{
    Produk.getAll((err, results) => {
    if (err) throw err;
    res.render('produk', { produk: results }); // ← kirim ke view
    });
    }
    
  },


  
   store: (req, res) => {


  const { nama, harga, stok } = req.body;

  Produk.createWithStok({ nama, harga, stok }, (err, result) => {
    if (err) throw err;
    res.redirect('/produk');
  });
  },
  
    create:(req,res)=>{
         res.render('produkCreate', {
    errors: [], // ← tambahkan ini agar EJS tidak error
    old: {}     // optional: untuk value sebelumnya
  });
  },

edit: (req, res) => {
  const id = req.params.id;
  Produk.findById(id, (err, produk) => {
    if (err) throw err;
    res.render('produkEdit', { produk, errors: [], old: produk });
  });
},

update: (req, res) => {
 const id = req.params.id;
  const { nama, harga, stok } = req.body;  

  Produk.updateWithStok(id, { nama, harga, stok }, (err) => {
    if (err) throw err;
    res.redirect('/produk');
  });
},

destroy: (req, res) => {
    const id = req.params.id;

    Produk.deleteWithStok(id, (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Gagal menghapus produk');
      }
      res.redirect('/produk'); // kembali ke daftar produk
    });
}
  
};
