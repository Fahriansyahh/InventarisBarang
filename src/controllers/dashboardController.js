const Dashboard=require('../models/Dashboard')

module.exports={
  index: (req, res) => {
    Dashboard.getStats((err, stats) => {
      if (err) {
        console.error("Gagal mengambil data dashboard:", err);
        return res.status(500).send("Terjadi kesalahan.");
      }
      res.render('index', { stats });
    });
  }
}