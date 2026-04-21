import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createShelter, findShelterByEmail, getAllShelters, getShelterById, updateShelter } from '../services/shelter.service.js';

export const registerShelter = async (req, res) => {
  try {
    const { name, address, email, password, type, capacity } = req.body;

    // Verifica se já existe
    const existing = await findShelterByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const shelter = await createShelter({
      name,
      address,
      email,
      password: hashedPassword,
      type,
      capacity
    });

    res.status(201).json(shelter);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar abrigo' });
  }
};

export const loginShelter = async (req, res) => {
  try {
    const { email, password } = req.body;

    const shelter = await findShelterByEmail(email);

    if (!shelter) {
      return res.status(404).json({ error: 'Abrigo não encontrado' });
    }

    const isValid = await bcrypt.compare(password, shelter.password);

    if (!isValid) {
      return res.status(401).json({ error: 'Senha inválida' });
    }

    const token = jwt.sign(
      { id: shelter.id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });

  } catch (err) {
    res.status(500).json({ error: 'Erro no login' });
  }
};

export const listShelters = async (req, res) => {
  try {
    const shelters = await getAllShelters();
    res.json(shelters);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar abrigos' });
  }
};

export const getShelter = async (req, res) => {
  try {
    const { id } = req.params;

    const shelter = await getShelterById(id);

    if (!shelter) {
      return res.status(404).json({ error: 'Abrigo não encontrado' });
    }

    res.json(shelter);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar abrigo' });
  }
};

export const getMyShelter = async (req, res) => {
  try {
    const shelterId = req.user.id;

    const shelter = await getShelterById(shelterId);

    res.json(shelter);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
};

export const updateShelterController = async (req, res) => {
  try {
    const shelterId = req.user.id; // vem do JWT
    const data = req.body;

    const shelter = await getShelterById(shelterId);

    if (!shelter) {
      return res.status(404).json({ error: 'Abrigo não encontrado' });
    }

    // 🔒 Regra: capacity não pode ser menor que ocupação atual
    if (data.capacity && data.capacity < shelter.current_occupancy) {
      return res.status(400).json({
        error: 'Capacidade não pode ser menor que ocupação atual'
      });
    }

    // 🔐 Hash de senha (se vier)
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // ⚠️ Status FULL não pode ser setado manualmente
    if (data.status === 'full') {
      return res.status(400).json({
        error: 'Status "full" é automático'
      });
    }

    const updated = await updateShelter(shelterId, data);

    res.json(updated);

  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar abrigo' });
  }
};