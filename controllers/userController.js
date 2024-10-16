const pool = require("../config/database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT user_id, lastname, firstname, username, gender, created_at, updated_at FROM users');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const [rows] = await pool.query('SELECT user_id, lastname, firstname, username, gender, created_at, updated_at FROM users WHERE id = ?', [id]); // Include gender

        if (rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createUser = async (req, res) => {
    const { lastname, firstname, username, password, gender } = req.body; // Include gender

    // Validate gender input
    if (gender !== 'M' && gender !== 'F') {
        return res.status(400).json({ error: 'Must be M or F.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await pool.query('INSERT INTO users (lastname, firstname, username, passwordx, gender) VALUES (?, ?, ?, ?, ?)', 
        [lastname, firstname, username, hashedPassword, gender]); // Insert gender

        res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { lastname, firstname, username, passwordx, gender } = req.body; // Use lastname and firstname

    // Validate gender input
    if (gender !== 'M' && gender !== 'F') {
        return res.status(400).json({ error: 'Invalid gender value. Must be M or F.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(passwordx, 10); // Hash passwordx
        const [result] = await pool.query(
            'UPDATE users SET lastname = ?, firstname = ?, username = ?, passwordx = ?, gender = ? WHERE user_id = ?', 
            [lastname, firstname, username, hashedPassword, gender, id] // Update with new fields
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
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
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllUsers, getUserById, createUser, updateUser, deleteUser };
