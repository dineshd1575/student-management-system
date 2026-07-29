const express = require('express');
const router = express.Router();
const db = require('../db/database');

// GET all students (with optional search by name/roll_no)
router.get('/', (req, res) => {
  const { search } = req.query;
  let sql = 'SELECT * FROM students';
  let params = [];

  if (search) {
    sql += ' WHERE name LIKE ? OR roll_no LIKE ?';
    params = [`%${search}%`, `%${search}%`];
  }

  sql += ' ORDER BY id DESC';

  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// GET single student by id
router.get('/:id', (req, res) => {
  db.get('SELECT * FROM students WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Student not found' });
    res.json(row);
  });
});

// POST create new student
router.post('/', (req, res) => {
  const { name, roll_no, department, year, email, phone } = req.body;

  if (!name || !roll_no || !department || !year) {
    return res.status(400).json({ error: 'name, roll_no, department, year are required' });
  }

  const sql = `INSERT INTO students (name, roll_no, department, year, email, phone)
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [name, roll_no, department, year, email || '', phone || ''], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    res.status(201).json({ id: this.lastID, name, roll_no, department, year, email, phone });
  });
});

// PUT update student
router.put('/:id', (req, res) => {
  const { name, roll_no, department, year, email, phone } = req.body;

  const sql = `UPDATE students SET name = ?, roll_no = ?, department = ?, year = ?, email = ?, phone = ?
               WHERE id = ?`;

  db.run(sql, [name, roll_no, department, year, email, phone, req.params.id], function (err) {
    if (err) return res.status(400).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student updated successfully' });
  });
});

// DELETE student
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM students WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Student not found' });
    res.json({ message: 'Student deleted successfully' });
  });
});

module.exports = router;
