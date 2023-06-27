const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
  codigo_asesor: {
    type: Number,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
});

const Bitacora = mongoose.model('Bitacora', bitacoraSchema);

module.exports = Bitacora;
