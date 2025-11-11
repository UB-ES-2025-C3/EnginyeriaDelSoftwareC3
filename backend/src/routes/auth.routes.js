import { z } from 'zod';
import { User } from '../models/User.js';
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Email i contrasenya són obligatoris',
        errorType: 'MISSING_FIELDS'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(401).json({ 
        error: 'El correu no està registrat',
        errorType: 'EMAIL_NOT_FOUND'
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ 
        error: 'La contrasenya no és correcta',
        errorType: 'INVALID_PASSWORD'
      });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, id: user._id },
      process.env.JWT_SECRET || env.jwtSecret,
      { expiresIn: '7d' }
    );

    // ⭐ CAMBIO 1: Incluye TODOS los datos del usuario en login
    res.json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        bio: user.bio || '',
        links: user.links || {}
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

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ 
        error: 'Tots els camps són obligatoris' 
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Aquest correu ja està registrat' 
      });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      passwordHash
    });

    await user.save();

    const token = jwt.sign(
      { userId: user._id, email: user.email, id: user._id },
      process.env.JWT_SECRET || env.jwtSecret,
      { expiresIn: '7d' }
    );

    // ⭐ CAMBIO 2: Incluye TODOS los datos del usuario en registro
    res.status(201).json({ 
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        bio: user.bio || '',
        links: user.links || {}
      }
    });

  } catch (error) {
    console.error('Error en register:', error);
    res.status(500).json({ 
      error: 'Error del servidor' 
    });
  }
});

// ⭐ CAMBIO 3: Endpoint /me retorna TODOS los datos del usuario
router.get('/me', async (req, res) => {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    const payload = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(payload.id).select('_id name email avatarUrl bannerUrl bio links');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    return res.json({ 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl || '',
        bannerUrl: user.bannerUrl || '',
        bio: user.bio || '',
        links: user.links || {}
      }
    });
  } catch {
    return res.status(401).json({ error: 'Token inválido' });
  }
});

export default router;