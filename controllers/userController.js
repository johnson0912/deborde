const pool = require('../config/database');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users');
    res.json(rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const [row] = await pool.query('SELECT user_id, fullname, username, created_at, updated_at FROM users WHERE user_id = ?', [id]);
    if (row.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { fullname, username, password } = req.body;

  // Validation
  if (!fullname || !username || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    const hashedPassword = await bcrypt.hash(password, salt);
    await pool.query('INSERT INTO users (fullname, username, password) VALUES (?, ?, ?)', [fullname, username, hashedPassword]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { fullname, username, password } = req.body;

  // Validation
  if (!fullname || !username) {
    return res.status(400).json({ error: 'Fullname and username are required' });
  }

  try {
    const hashedPassword = password ? await bcrypt.hash(password, await bcrypt.genSalt(10)) : undefined;
    const [result] = await pool.query('UPDATE users SET fullname = ?, username = ?, password = ? WHERE user_id = ?', [fullname, username, hashedPassword, id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM users WHERE user_id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
