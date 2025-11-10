import { z } from 'zod';
import { User } from '../models/User.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = express.Router();

const registerSchema = z.object({
  name: z.string().min(2).max(60),
  email: z.string().email(),
  password: z.string().min(8, 'Min 8 chars')
    .regex(/[A-Z]/, '1 mayúscula')
    .regex(/[a-z]/, '1 minúscula')
    .regex(/\d/, '1 número')
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validación básica
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email i contrasenya són obligatoris',
        errorType: 'MISSING_FIELDS'
      });
    }

    // 1. Verificar si el correo existe
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'El correu no està registrat',
        errorType: 'EMAIL_NOT_FOUND'
      });
    }

    // 2. Verificar si la contraseña es correcta
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'La contrasenya no és correcta',
        errorType: 'INVALID_PASSWORD'
      });
    }

    // 3. Generar token JWT (ajusta el SECRET según tu configuración)
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'tu-secret-key',
      { expiresIn: '7d' }
    );

    // 4. Respuesta exitosa
    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        bio: user.bio
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ 
      error: 'Error del servidor',
      errorType: 'SERVER_ERROR'
    });
  }
});

// POST /api/auth/register (si aún no lo tienes)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Tots els camps són obligatoris' 
      });
    }

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Aquest correu ja està registrat' 
      });
    }

    // Hash de la contraseña
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Crear usuario
    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      passwordHash
    });

    await user.save();

    // Generar token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'tu-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ 
      error: 'Error del servidor' 
    });
  }
});

router.get('/me', async (req, res) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id).select('_id name email');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    return res.json({ user });
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;
