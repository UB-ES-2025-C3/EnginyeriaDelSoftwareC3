import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../middlewares/auth.js'; 
import { User } from '../models/User.js';

const router = Router();


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
  links: linksSchema.optional()
});


router.put('/me', auth, async (req, res) => {
  try {
    // Validar que les dades arriben al body
    console.log('Body rebut:', req.body);
    const data = updateProfileSchema.parse(req.body);
    console.log('Data validada:', data);

    const updateData = {};

    // Comprovar si el camp existeix a les dades
    if (data.name !== undefined || data.name === '') {
      updateData.name = data.name;
    }
    if (data.bio !== undefined || data.bio === '') {
      updateData.bio = data.bio;
    }

    if (data.links) {
      for (const [key, value] of Object.entries(data.links)) {
        if (value !== undefined) {
          updateData[`links.${key}`] = value;
        }
      }
    }
    console.log('updateData:', updateData);

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

export default router;