'use strict';

const complaintService = require('../services/complaintService');

async function createComplaint(req, res, next) {
  try {
    const {
      category, description, anonymous, subject, course, courseCode,
      teacher, classroom, incidentDate, incidentTime,
    } = req.body;
    const complaint = await complaintService.createComplaint({
      category,
      description,
      anonymous,
      reportedById: req.user ? req.user.id : null,
      imageFile: req.file || null,
      metadata: {
        subject,
        course,
        courseCode,
        teacher,
        classroom,
        incidentDate,
        incidentTime,
      },
    });
    res.status(201).json({ status: 'success', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function uploadImage(req, res, next) {
  try {
    if (!req.file) throw new Error('No image provided');
    const complaint = await complaintService.uploadComplaintImage(req.params.id, req.file);
    res.json({ status: 'success', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function uploadComplaintImage(req, res, next) {
  return uploadImage(req, res, next);
}

async function listComplaints(req, res, next) {
  try {
    const { page, limit, status, category } = req.query;
    const result = await complaintService.listComplaints({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      category,
      userRole: req.user?.role,
      userId: req.user?.id,
    });
    res.json({ status: 'success', data: result });
  } catch (error) {
    next(error);
  }
}

async function getComplaint(req, res, next) {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
    res.json({ status: 'success', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const history = await complaintService.getComplaintHistory(req.params.id);
    res.json({ status: 'success', data: history });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const { status, note } = req.body;
    const complaint = await complaintService.updateComplaintStatus(req.params.id, status, req.user.id, note);
    res.json({ status: 'success', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function addWarning(req, res, next) {
  try {
    const complaint = await complaintService.addWarning(req.params.id, req.user.id);
    res.json({ status: 'success', data: complaint });
  } catch (error) {
    next(error);
  }
}

async function getStrikes(req, res, next) {
  try {
    const strikes = await complaintService.getStrikes(req.params.id);
    res.json({ status: 'success', data: strikes });
  } catch (error) {
    next(error);
  }
}

async function getMyComplaints(req, res, next) {
  try {
    const complaints = await complaintService.getMyComplaints(req.user.id);
    res.json({ status: 'success', data: complaints });
  } catch (error) {
    next(error);
  }
}

async function getDashboard(req, res, next) {
  try {
    const dashboard = await complaintService.getDashboard();
    res.json({ status: 'success', data: dashboard });
  } catch (error) {
    next(error);
  }
}

async function deleteComplaint(req, res, next) {
  try {
    await complaintService.deleteComplaint(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createComplaint, uploadImage, listComplaints, getComplaint,
  uploadComplaintImage, getHistory, updateStatus, addWarning, getStrikes, getMyComplaints,
  getDashboard, deleteComplaint,
};
