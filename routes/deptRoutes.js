const express = require('express');
const router = express.Router();
const { getAllDepartments, getDepartmentById, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/deptcontroller');
const authenticateToken = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllDepartments);
router.get('/:id', authenticateToken, getDepartmentById);
router.post('/', authenticateToken, createDepartment);
router.put('/:id', authenticateToken, updateDepartment);
router.delete('/:id', authenticateToken, deleteDepartment);

module.exports = router;
