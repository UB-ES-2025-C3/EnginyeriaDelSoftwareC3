// config/multer.config.js
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear carpeta de uploads si no existe
const uploadsDir = path.join(process.cwd(), 'uploads', 'solicitudes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-random-nombre-original
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    cb(null, `${uniqueSuffix}-${name}${ext}`);
  }
});

// Filtro de archivos permitidos
const fileFilter = (req, file, cb) => {
  const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
  
  const allowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido: ${file.mimetype}. Solo se permiten imágenes (JPEG, PNG, GIF, WebP) y vídeos (MP4, WebM, MOV, AVI).`), false);
  }
};

// Límites de tamaño
const limits = {
  fileSize: 20 * 1024 * 1024, // 20 MB por archivo
  files: 5 // Máximo 5 archivos
};

// Configuración de multer
export const uploadSolicitud = multer({
  storage,
  fileFilter,
  limits
});

// Middleware para validar tamaños específicos por tipo
export const validateFileSize = (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB para imágenes
  const MAX_VIDEO_SIZE = 20 * 1024 * 1024; // 20 MB para vídeos

  for (const file of req.files) {
    const isImage = file.mimetype.startsWith('image/');
    const isVideo = file.mimetype.startsWith('video/');

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: false,
        message: `La imagen "${file.originalname}" supera el límite de 5 MB`
      });
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return res.status(400).json({
        success: false,
        message: `El vídeo "${file.originalname}" supera el límite de 20 MB`
      });
    }
  }

  next();
};