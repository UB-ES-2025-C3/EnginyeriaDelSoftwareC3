import mongoose from 'mongoose';

const solicitudSchema = new mongoose.Schema({
  nombre:    { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email:     { type: String, required: true, trim: true, lowercase: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  tipo:      { type: String, required: true, enum: ['queja', 'mejora', 'comentario'], default: 'comentario' },
  asunto:    { type: String, required: true, trim: true, minlength: 5, maxlength: 150 },
  mensaje:   { type: String, required: true, trim: true, minlength: 10, maxlength: 1000 },
  
  // ⭐ NUEVO: Archivos adjuntos
  archivos:  [{ 
    url: { type: String, required: true },
    tipo: { type: String, enum: ['imagen', 'video'], required: true },
    nombre: { type: String, required: true },
    tamaño: { type: Number, required: true } // en bytes
  }],
  
  fecha:     { type: Date, default: Date.now },
  leido:     { type: Boolean, default: false }
}, { 
  versionKey: false,
  timestamps: true 
});

// Índices para búsquedas más eficientes
solicitudSchema.index({ fecha: -1 });
solicitudSchema.index({ email: 1 });

export const Solicitud = mongoose.model('Solicitud', solicitudSchema);