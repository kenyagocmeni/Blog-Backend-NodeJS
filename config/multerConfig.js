const multer = require('multer');
const path = require('path');

// Yükleme işleminin yapılacağı dizini ve dosya isimlerini belirleme:
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "uploads/");  // Dosyaların saklanacağı klasör
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// Dosya formatı filtresi (sadece resim dosyalarına izin verilir):
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error("Sadece resimler kabul edilir."));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
