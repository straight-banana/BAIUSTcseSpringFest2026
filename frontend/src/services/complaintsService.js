import api, { API_BASE_URL, getToken } from './api.js';

export const COMPLAINT_CATEGORIES = ['TIFFIN_THEFT', 'BRIBE', 'LARGE_SYLLABUS', 'OTHER'];
export const COMPLAINT_STATUSES = ['PENDING', 'REVIEWED', 'RESOLVED'];

export const submitComplaint = ({ category, description, anonymous = true }) =>
  api.post('/complaints', { category, description, anonymous }).then((r) => r.data);

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

export const listComplaints = () => api.get('/complaints').then((r) => r.data);
export const listMyComplaints = () => api.get('/complaints/my').then((r) => r.data);
export const getComplaint = (id) => api.get(`/complaints/${id}`).then((r) => r.data);
export const getComplaintHistory = (id) => api.get(`/complaints/${id}/history`).then((r) => r.data);
export const getComplaintDashboard = () => api.get('/complaints/dashboard').then((r) => r.data);
export const updateComplaintStatus = (id, status) =>
  api.patch(`/complaints/${id}/status`, { status }).then((r) => r.data);
export const warnComplaint = (id) => api.patch(`/complaints/${id}/warn`).then((r) => r);
export const deleteComplaint = (id) => api.del(`/complaints/${id}`).then((r) => r.data);
