const db = require('./db');

module.exports = {
  getAll: (callback) => {
    const query = `
      SELECT pembelian.*, produk.nama,produk.harga 
      FROM pembelian 
      JOIN produk ON pembelian.produk_id = produk.id
    `;
    db.query(query, callback);
  },
  create: (produk_id, jumlah, total, status, callback) => {
    const query = `
      INSERT INTO pembelian (produk_id, jumlah, total, status)
      VALUES (?, ?, ?, ?)
    `;
    db.query(query, [produk_id, jumlah, total, status], callback);
  },

  // Update stok produk
  updateStok: (produk_id, jumlah, callback) => {
    const query = `
      UPDATE stok
      SET jumlah = jumlah + ?
      WHERE produk_id = ?
    `;
    db.query(query, [jumlah, produk_id], callback);
  },
delete: (id, callback) => {
    const getQuery = 'SELECT produk_id, jumlah FROM pembelian WHERE id = ?';
    db.query(getQuery, [id], (err, rows) => {
      if (err) return callback(err);
      if (!rows.length) return callback(new Error('Pembelian tidak ditemukan'));

      const { produk_id, jumlah } = rows[0];

      // Update stok: kurangi jumlah pembelian
      const updateStok = 'UPDATE stok SET jumlah = jumlah - ? WHERE produk_id = ?';
      db.query(updateStok, [jumlah, produk_id], (err) => {
        if (err) return callback(err);

        // Hapus pembelian
        const del = 'DELETE FROM pembelian WHERE id = ?';
        db.query(del, [id], callback);
      });
    });
  },
searchByDate: (tanggal, callback) => {
  const query = `SELECT pembelian.*, produk.nama, produk.harga,
    (pembelian.jumlah * produk.harga) AS total
    FROM pembelian
    JOIN produk ON pembelian.produk_id = produk.id
    WHERE DATE(pembelian.created_at) = ?
    ORDER BY pembelian.created_at DESC`;
  db.query(query, [tanggal], callback);
}


};
