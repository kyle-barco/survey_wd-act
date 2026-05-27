const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const prisma = require('../config/db');


// GET /admin/dashboard
const getDashboard = async (req, res) => {
  try {
    const [userCount, feedbackCount, disasterCount, recentFeedbacks] = await Promise.all([
      prisma.user.count(),
      prisma.classroomFeedback.count(),
      prisma.disasterSurvey.count(),
      prisma.classroomFeedback.findMany({ take: 5, orderBy: { createdAt: 'desc' }, include: { user: true } })
    ]);
    res.render('admin/dashboard', {
      title: 'Admin Dashboard', userCount, feedbackCount, disasterCount, recentFeedbacks
    });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load dashboard.');
    res.redirect('/login');
  }
};

// GET /admin/users
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
    res.render('admin/users', { title: 'Manage Users', users });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load users.');
    res.redirect('/admin/dashboard');
  }
};

// GET /admin/users/:id/edit
const getEditUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: parseInt(req.params.id) } });
    if (!user) { req.flash('error', 'User not found.'); return res.redirect('/admin/users'); }
    res.render('admin/edit-user', { title: 'Edit User', editUser: user });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/users');
  }
};

// PUT /admin/users/:id
const updateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('error', errors.array().map(e => e.msg).join(', '));
    return res.redirect(`/admin/users/${req.params.id}/edit`);
  }
  const { name, email, role, phone, address } = req.body;
  try {
    await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, email, role, phone: phone || null, address: address || null }
    });
    req.flash('success', 'User updated successfully.');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update user.');
    res.redirect('/admin/users');
  }
};

// DELETE /admin/users/:id
const deleteUser = async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: parseInt(req.params.id) } });
    req.flash('success', 'User deleted.');
    res.redirect('/admin/users');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete user.');
    res.redirect('/admin/users');
  }
};

// GET /admin/surveys
const getSurveys = async (req, res) => {
  try {
    const feedbacks = await prisma.classroomFeedback.findMany({
      orderBy: { createdAt: 'desc' }, include: { user: true }
    });
    const disasters = await prisma.disasterSurvey.findMany({
      orderBy: { createdAt: 'desc' }, include: { user: true }
    });
    res.render('admin/surveys', { title: 'All Surveys', feedbacks, disasters });
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to load surveys.');
    res.redirect('/admin/dashboard');
  }
};

module.exports = { getDashboard, getUsers, getEditUser, updateUser, deleteUser, getSurveys };
