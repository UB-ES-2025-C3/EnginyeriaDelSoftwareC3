// routes/solicitud.routes.js
import express from 'express';
import { Solicitud } from '../models/Solicitud.js';
import { uploadSolicitud, validateFileSize } from '../config/multer.config.js';

const router = express.Router();

// POST - Crear nueva solicitud con archivos
router.post('/solicitudes', 
  uploadSolicitud.array('archivos', 5), // Máximo 5 archivos
  validateFileSize,
  async (req, res) => {
    try {
      const { nombre, email, tipo, asunto, mensaje } = req.body;

      // Validación básica
      if (!nombre || !email || !tipo || !asunto || !mensaje) {
        return res.status(400).json({
          success: false,
          message: 'Tots els camps són obligatoris'
        });
      }

      // Procesar archivos subidos
      const archivos = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const isImage = file.mimetype.startsWith('image/');
          archivos.push({
            url: `/uploads/solicitudes/${file.filename}`,
            tipo: isImage ? 'imagen' : 'video',
            nombre: file.originalname,
            tamaño: file.size
          });
        }
      }

      // Crear nueva solicitud
      const nuevaSolicitud = new Solicitud({
        nombre: nombre.trim(),
        email: email.trim().toLowerCase(),
        tipo,
        asunto: asunto.trim(),
        mensaje: mensaje.trim(),
        archivos
      });

      // Guardar en la base de datos
      await nuevaSolicitud.save();

      res.status(201).json({
        success: true,
        message: 'Solicitud creada correctament',
        data: nuevaSolicitud
      });

    } catch (error) {
      console.error('Error al crear solicitud:', error);
      
      // Error de validación de Mongoose
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Error de validació',
          errors: error.errors
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error del servidor al crear la solicitud'
      });
    }
  }
);

// GET - Obtener todas las solicitudes (opcional, para admin)
router.get('/solicitudes', async (req, res) => {
  try {
    const solicitudes = await Solicitud.find()
      .sort({ fecha: -1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: solicitudes.length,
      data: solicitudes
    });

  } catch (error) {
    console.error('Error al obtener solicitudes:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor al obtenir solicituds'
    });
  }
});

// GET - Obtener una solicitud por ID (opcional, para admin)
router.get('/solicitudes/:id', async (req, res) => {
  try {
    const solicitud = await Solicitud.findById(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no trobada'
      });
    }

    res.status(200).json({
      success: true,
      data: solicitud
    });

  } catch (error) {
    console.error('Error al obtener solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// PATCH - Marcar solicitud como leída (opcional, para admin)
router.patch('/solicitudes/:id/leido', async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndUpdate(
      req.params.id,
      { leido: true },
      { new: true }
    );

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no trobada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud marcada com a llegida',
      data: solicitud
    });

  } catch (error) {
    console.error('Error al actualizar solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// DELETE - Eliminar solicitud (opcional, para admin)
router.delete('/solicitudes/:id', async (req, res) => {
  try {
    const solicitud = await Solicitud.findByIdAndDelete(req.params.id);

    if (!solicitud) {
      return res.status(404).json({
        success: false,
        message: 'Solicitud no trobada'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Solicitud eliminada correctament'
    });

  } catch (error) {
    console.error('Error al eliminar solicitud:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
});

// Error handler de multer
router.use((err, _req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'Un dels fitxers supera el límit de mida.' });
    }
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next(err);
});

export default router;