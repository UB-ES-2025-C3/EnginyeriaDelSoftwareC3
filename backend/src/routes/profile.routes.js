import { Router } from 'express';
import { z } from 'zod';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { auth } from '../middlewares/auth.js'; 
import { User } from '../models/User.js';

const router = Router();

/* ---------- Multer config ---------- */
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path.basename(file.originalname, ext).replace(/[^\w\-]+/g, '');
    cb(null, `${req.user.id}-${Date.now()}-${safeBase}${ext}`);
  },
});

const ALLOWED = ['image/jpeg', 'image/png'];
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED.includes(file.mimetype)) {
      const err = new Error('UNSUPPORTED_FORMAT');
      err.code = 'UNSUPPORTED_FORMAT';
      return cb(err);
    }
    cb(null, true);
  },
});

// Obtenir les dades del perfil de l'usuari loguejat
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash'); 

    if (!user) {
      return res.status(404).json({ error: 'Usuari no trobat' });
    }
    
    return res.json(user);

  } catch (err) {
    return res.status(500).json({ error: 'Error en obtenir el perfil' });
  }
});

// Actualitzar les dades de text del perfil (nom, bio, links)
const linksSchema = z.object({
  steam: z.string().url('URL de Steam invàlida').or(z.literal('')).optional(),
  psn: z.string().trim().optional(),
  xbox: z.string().trim().optional(),
  nintendo: z.string().trim().optional(),
  twitch: z.string().url('URL de Twitch invàlida').or(z.literal('')).optional(),
  youtube: z.string().url('URL de YouTube invàlida').or(z.literal('')).optional(),
}).partial(); 

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Min 2 caràcters').max(60, 'Max 60 caràcters').optional(),
  bio: z.string().max(250, 'Max 250 caràcters').optional(),
  links: linksSchema.optional(),
  avatarUrl: z.string().url().or(z.literal('')).optional(), 
  bannerUrl: z.string().url().or(z.literal('')).optional(), 
});


router.put('/me', auth, async (req, res) => {
  try {
    // Validar que les dades arriben al body
    const data = updateProfileSchema.parse(req.body);
    const updateData = {};

    // Comprovar si el camp existeix a les dades
    if (data.name !== undefined || data.name === '') {
      updateData.name = data.name;
    }
    if (data.bio !== undefined || data.bio === '') {
      updateData.bio = data.bio;
    }

    // Comprovació per avatar i banner
    if (data.avatarUrl !== undefined) {
      updateData.avatarUrl = data.avatarUrl;
    }
    if (data.bannerUrl !== undefined) {
      updateData.bannerUrl = data.bannerUrl;
    }

    if (data.links) {
      for (const [key, value] of Object.entries(data.links)) {
        if (value !== undefined) {
          updateData[`links.${key}`] = value;
        }
      }
    }

    // Buscar l'usuari i actualitzar-lo a la BBDD
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true }
    ).select('-passwordHash');

    console.log('Usuari actualitzat:', updatedUser);
    return res.json(updatedUser);

  } catch (err) {
    if (err?.issues) return res.status(400).json({ error: 'Dades invàlides', details: err.issues });
    console.error(err); 
    return res.status(500).json({ error: 'Error en actualitzar el perfil' });
  }
});

// POST imatges
router.post(
  '/me/media',
  auth,
  upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]),
  async (req, res) => {
    try {
      const avatarFile = req.files?.avatar?.[0];
      const bannerFile = req.files?.banner?.[0];
      const base = `${req.protocol}://${req.get('host')}`;

      const out = {};
      if (avatarFile) out.avatarUrl = `${base}/uploads/${avatarFile.filename}`;
      if (bannerFile) out.bannerUrl = `${base}/uploads/${bannerFile.filename}`;

      return res.json(out);
    } catch (e) {
      return res.status(400).json({ error: 'UPLOAD_FAILED' });
    }
  }
);

// Error handler de multer
router.use((err, _req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'FILE_TOO_LARGE' });
  }

  if (err.code === 'UNSUPPORTED_FORMAT') {
    return res.status(400).json({ error: 'UNSUPPORTED_FORMAT' });
  }
  next(err);
});

export default router;