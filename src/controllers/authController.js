const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');
const logger = require('../utils/logger');

const USERS_FILE = path.join(__dirname, '../../storage/users.json');

// Helper to ensure users file exists
const ensureUsersFile = async () => {
  await fs.ensureDir(path.dirname(USERS_FILE));
  if (!(await fs.pathExists(USERS_FILE))) {
    await fs.writeJson(USERS_FILE, []);
  }
};

const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  return { salt, hash };
};

const verifyPassword = (password, hash, salt) => {
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
  return hash === hashVerify;
};

const generateToken = (userId) => {
  // Simple custom token logic since jsonwebtoken isn't available
  const token = crypto.randomBytes(32).toString('hex');
  // Format token as base64 JSON payload similar to JWT for ease of extraction if needed later
  const payload = Buffer.from(JSON.stringify({ id: userId, exp: Date.now() + 7*24*60*60*1000 })).toString('base64');
  return `${payload}.${token}`;
};

const register = async (req, res, next) => {
  try {
    await ensureUsersFile();
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ success: false, error: 'Email, password, and name are required' });
    }

    const users = await fs.readJson(USERS_FILE);
    
    if (users.find(u => u.email === email)) {
      return res.status(400).json({ success: false, error: 'Email already exists' });
    }

    const { salt, hash } = hashPassword(password);

    const newUser = {
      id: uuidv4(),
      email,
      name,
      salt,
      hash,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await fs.writeJson(USERS_FILE, users);

    const token = generateToken(newUser.id);

    res.status(201).json({
      success: true,
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
  } catch (error) {
    logger.error(`Registration error: ${error.message}`);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    await ensureUsersFile();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const users = await fs.readJson(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    if (!verifyPassword(password, user.hash, user.salt)) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = generateToken(user.id);

    res.json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    logger.error(`Login error: ${error.message}`);
    next(error);
  }
};

module.exports = {
  register,
  login
};
