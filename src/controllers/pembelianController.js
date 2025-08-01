const Produk = require('../models/Produk');
const Pembelian=require('../models/Pembelian')
const { Parser } = require('json2csv');

module.exports = {
  index: (req, res) => {
      Produk.getAll((err, results) => {
       if (err) throw err;
       res.render('inputPurchase', { produk: results }); // ← kirim ke view
       });
  },

 store: (req, res) => {
    const { produk_id, jumlah, total, status } = req.body;
    const jumlahInt = parseInt(jumlah);
    const totalInt = parseInt(total);
    const statusFix = status || 'selesai'; // default ke 'selesai' kalau kosong

    // Simpan pembelian dulu
    Pembelian.create(produk_id, jumlahInt, totalInt, statusFix, (err, result) => {
      if (err) {
        console.error('Gagal simpan pembelian:', err);
        return res.status(500).send('Gagal menyimpan pembelian');
      }

      // Update stok jika pembelian berhasil
      Pembelian.updateStok(produk_id, jumlahInt, (err) => {
        if (err) {
          console.error('Gagal update stok:', err);
          return res.status(500).send('Gagal update stok');
        }

        // Berhasil → redirect ke halaman daftar pembelian
        res.redirect('/pembelian/create');
      });
    });
  },

show: (req, res) => {
  const tanggal = req.query.tanggal || '';

  if (tanggal) {
    Pembelian.searchByDate(tanggal, (err, results) => {
      if (err) throw err;
      res.render('listPurchase', { pembelian: results, tanggal });
    });
  } else {
    Pembelian.getAll((err, results) => {
      if (err) {
        console.error("Gagal mengambil data pembelian:", err);
        return res.status(500).send("Terjadi kesalahan saat mengambil data.");
      }
      res.render('listPurchase', { pembelian: results, tanggal: '' });
    });
  }
},
 destroy: (req, res) => {
    const id = req.params.id;
    Pembelian.delete(id, (err) => {
      if (err) {
        console.error('Gagal batalkan pembelian:', err);
        return res.status(500).send('Gagal batalkan pembelian');
      }
      res.redirect('/pembelian');
    });
  },

downloadCSV: (req, res) => {
  const tanggal = req.query.tanggal || '';

  const callback = (err, data) => {
    if (err) {
      console.error("Gagal mengambil data pembelian:", err);
      return res.status(500).send("Terjadi kesalahan.");
    }

   
    const fields = ['nama', 'harga', 'jumlah', 'total','status','created_at'];
    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('pembelian.csv');
    res.send(csv);
  };

  if (tanggal) {
    Pembelian.searchByDate(tanggal, callback);
  } else {
    Pembelian.getAll(callback);
  }
},


};
