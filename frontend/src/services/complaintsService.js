import api, { API_BASE_URL, getToken } from './api.js';

export const COMPLAINT_CATEGORIES = ['TIFFIN_THEFT', 'BRIBE', 'LARGE_SYLLABUS', 'OTHER'];
export const COMPLAINT_STATUSES = ['PENDING', 'UNDER_REVIEW', 'INVESTIGATING', 'RESOLVED', 'REJECTED'];

const mapComplaint = (complaint) => {
  if (!complaint) return complaint;
  const metadata = complaint.metadata || {};
  const title = complaint.subject || metadata.subject || complaint.title || (complaint.description ? complaint.description.slice(0, 80) : '');
  const submittedAt = complaint.submittedAt || complaint.createdAt;
  const lastUpdated = complaint.lastUpdated || complaint.updatedAt;
  const hasEvidence = complaint.hasEvidence ?? !!complaint.imageUrl;
  const evidenceCount = complaint.evidenceCount ?? (complaint.imageUrl ? 1 : 0);
  const strikeWeight = complaint.strikeWeight ?? complaint.warningCount ?? 0;
  return {
    ...complaint,
    subject: complaint.subject || metadata.subject,
    course: complaint.course || metadata.course,
    courseCode: complaint.courseCode || metadata.courseCode,
    teacher: complaint.teacher || metadata.teacher,
    classroom: complaint.classroom || metadata.classroom,
    incidentDate: complaint.incidentDate || metadata.incidentDate,
    incidentTime: complaint.incidentTime || metadata.incidentTime,
    metadata,
    title,
    submittedAt,
    lastUpdated,
    hasEvidence,
    evidenceCount,
    strikeWeight,
  };
};

const mapComplaintList = (data) => {
  if (!data) return data;
  return {
    ...data,
    complaints: (data.complaints || []).map(mapComplaint),
  };
};

export const submitComplaint = ({ category, description, anonymous = true, subject, course, courseCode, teacher, classroom, incidentDate, incidentTime, image }) => {
  const formData = new FormData();
  formData.append('category', category);
  formData.append('description', description);
  formData.append('anonymous', anonymous ? 'true' : 'false');
  if (subject) formData.append('subject', subject);
  if (course) formData.append('course', course);
  if (courseCode) formData.append('courseCode', courseCode);
  if (teacher) formData.append('teacher', teacher);
  if (classroom) formData.append('classroom', classroom);
  if (incidentDate) formData.append('incidentDate', incidentDate);
  if (incidentTime) formData.append('incidentTime', incidentTime);
  if (image?.file) formData.append('image', image.file);
  return api.upload('/complaints', formData).then((r) => mapComplaint(r.data));
};

export const uploadComplaintImage = async (complaintId, file) => {
  const fd = new FormData();
  fd.append('image', file);
  const token = getToken();
  const res = await fetch(`${API_BASE_URL}/complaints/${complaintId}/image`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const data = await res.json();
  if (!res.ok || data.success === false) throw new Error(data.message || 'Upload failed');
  return data.data;
};

export const listComplaints = () => api.get('/complaints').then((r) => mapComplaintList(r.data));
export const getComplaint = (id) => api.get(`/complaints/${id}`).then((r) => mapComplaint(r.data));
export const getComplaintDashboard = () => api.get('/complaints/dashboard').then((r) => r.data);
export const updateComplaintStatus = (id, status) =>
  api.patch(`/complaints/${id}/status`, { status }).then((r) => mapComplaint(r.data));
export const warnComplaint = (id) => api.patch(`/complaints/${id}/warn`).then((r) => mapComplaint(r.data));
export const deleteComplaint = (id) => api.del(`/complaints/${id}`).then((r) => r.data);
