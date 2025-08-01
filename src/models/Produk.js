const db = require('./db');

module.exports = {
getAll: (callback) => {
  const query = `
    SELECT produk.*, stok.jumlah AS stok
    FROM produk
    LEFT JOIN stok ON stok.produk_id = produk.id
  `;
  db.query(query, callback);
},
search: (keyword, callback) => {
  const query = `
    SELECT produk.*, COALESCE(stok.jumlah, 0) AS stok
    FROM produk
    LEFT JOIN stok ON stok.produk_id = produk.id
    WHERE produk.nama LIKE ?
  `;
  db.query(query, [`%${keyword}%`], callback);
},

findById: (id, callback) => {
    db.query(
      `SELECT produk.*, stok.jumlah as stok FROM produk
      JOIN stok ON stok.produk_id = produk.id
      WHERE produk.id = ?`,
      [id],
      (err, results) => {
        if (err) return callback(err);
        if (results.length === 0) return callback(null, null);
        callback(null, results[0]);
      }
    );
  },

//   getWithStok: (callback) => {
//     const query = `
//       SELECT produk.id, produk.nama, produk.harga, stok.jumlah AS stok
//       FROM produk
//       JOIN stok ON stok.produk_id = produk.id
//     `;
//     db.query(query, callback);
//   },

 findOne: (condition) => {
    return new Promise((resolve, reject) => {
      const keys = Object.keys(condition);
      const values = Object.values(condition);

      const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
      const sql = `SELECT * FROM produk WHERE ${whereClause} LIMIT 1`;

      db.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // hanya 1 record
      });
    });
  },

findOneByName: (nama) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM produk WHERE nama = ? LIMIT 1';
    db.query(sql, [nama], (err, rows) => {
      if (err) return reject(err);
      resolve(rows[0] || null);
    });
  });
},
  
    createWithStok: (data, callback) => {
    const { nama, harga, stok } = data;

    db.query(
      `INSERT INTO produk (nama, harga) VALUES (?, ?)`,
      [nama, harga],
      (err, result) => {
        if (err) return callback(err);

        const produkId = result.insertId;

        db.query(
          `INSERT INTO stok (produk_id, jumlah) VALUES (?, ?)`,
          [produkId, stok],
          (err2) => {
            if (err2) return callback(err2);

            callback(null, { id: produkId, nama, harga, stok });
          }
        );
      }
    );
  },

deleteWithStok: (id, callback) => {
 db.query('DELETE FROM pembelian WHERE produk_id = ?', [id], (err) => {
    if (err) return callback(err);
    // Hapus stok
    db.query('DELETE FROM stok WHERE produk_id = ?', [id], (err2) => {
      if (err2) return callback(err2);
      // Hapus produk
      db.query('DELETE FROM produk WHERE id = ?', [id], callback);
    });
  });
},


  updateWithStok: (id, data, callback) => {
  db.query(
    'UPDATE produk SET nama = ?, harga = ? WHERE id = ?',
    [data.nama, data.harga, id],
    (err) => {
      if (err) return callback(err);
      db.query(
        'UPDATE stok SET jumlah = ? WHERE produk_id = ?',
        [data.stok, id],
        callback
      );
    }
  );
}



};
