const db = require('./db');

module.exports = {
getStats: (callback) => {
  const query = `SELECT
    (SELECT COUNT(*) FROM produk) AS total_produk,
    (SELECT COUNT(*) FROM pembelian) AS total_pembelian,
    (SELECT SUM(jumlah) FROM stok) AS total_stok`;
  db.query(query, (err, result) => {
    if (err) return callback(err);
    callback(null, result[0]);
  });
}
};
