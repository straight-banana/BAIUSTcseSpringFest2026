# 🔗 React Frontend Integration Guide

All endpoints use the **base URL** of your deployed backend. Change this one constant and everything works.

---

## 1. Setup — Base URL & Fetch Config

```js
// src/api/client.js
const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data; // { success, message, data }
}
```

> **React env var**: Create `.env` in your React root:
> ```
> REACT_APP_API_URL=https://your-backend.railway.app/api/v1
> ```

---

## 2. Standard Response Envelope

Every API response:
```json
{ "success": true, "message": "...", "data": { ... } }
```
On error:
```json
{ "success": false, "message": "Error message", "statusCode": 401 }
```

---

## 3. Auth Endpoints

### Register
```js
const res = await apiFetch('/auth/register', {
  method: 'POST',
  body: JSON.stringify({ rollNumber: '005', name: 'Kuddus Mia', password: 'pass123' }),
});
localStorage.setItem('token', res.data.token);
```

### Login
```js
const res = await apiFetch('/auth/login', {
  method: 'POST',
  body: JSON.stringify({ rollNumber: '005', password: 'student123' }),
});
localStorage.setItem('token', res.data.token);
const { user, token } = res.data;
```

### Get Current User
```js
const res = await apiFetch('/auth/me');
console.log(res.data); // { id, rollNumber, name, role, createdAt }
```

---

## 4. Mission 1 — Anonymous Complaint System

### Submit Anonymous Complaint
```js
const res = await apiFetch('/complaints', {
  method: 'POST',
  body: JSON.stringify({
    category: 'TIFFIN_THEFT',  // TIFFIN_THEFT | BRIBE | LARGE_SYLLABUS | OTHER
    description: 'Kuddus stole my egg from my tiffin box again.',
    anonymous: true,
  }),
});
```

### Upload Complaint Image (EXIF Stripped)
```js
const formData = new FormData();
formData.append('image', fileInput.files[0]);
const token = localStorage.getItem('token');
const res = await fetch(`${BASE_URL}/complaints/${complaintId}/image`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData,
});
const data = await res.json();
console.log(data.data.imageUrl); // /uploads/complaints/uuid.jpg
```

### Admin Dashboard — Warnings
```js
const res = await apiFetch('/complaints/dashboard');
const { total, byCategory, byStatus, recentWarnings } = res.data;
// byCategory: [{ category: 'TIFFIN_THEFT', count: 5 }]
// recentWarnings: [{ id, category, warningCount, status }]
```

### Add Warning (Admin) — auto-resolves at 3
```js
const res = await apiFetch(`/complaints/${id}/warn`, { method: 'PATCH' });
console.log(res.message); // "Warning added (2/3)"
```

### Update Status (Admin)
```js
await apiFetch(`/complaints/${id}/status`, {
  method: 'PATCH',
  body: JSON.stringify({ status: 'REVIEWED' }), // PENDING|REVIEWED|RESOLVED
});
```

---

## 5. Mission 2 — Classroom Seat Planner

### Generate Seating Plan (Admin)
```js
const res = await apiFetch('/seats/plan', {
  method: 'POST',
  body: JSON.stringify({
    planName: 'Exam Hall - July 2026',
    gridCols: 6,
    students: [
      { name: 'Alice Rahman', rollNumber: '001', height: 145 },
      { name: 'Kuddus Mia',  rollNumber: '005', height: 172 },
      // ...
    ],
  }),
});
const { gridRows, gridCols, seats } = res.data;
// Kuddus → last row, center column (isKuddus: true)
// Short students → row 0 (front)
```

### Display Grid
```js
const res = await apiFetch('/seats');
const { gridRows, gridCols, seats } = res.data;

// Render:
for (let r = 0; r < gridRows; r++) {
  const rowSeats = seats.filter(s => s.row === r);
  // render each seat in the row
}
```

---

## 6. Mission 4 — Money & Tiffin Tracker

### Add Entry
```js
await apiFetch('/tracker', {
  method: 'POST',
  body: JSON.stringify({
    type: 'WASHROOM_TAX',  // WASHROOM_TAX | STOLEN_FOOD
    amount: 5,
    description: 'Kuddus charged 5tk washroom tax',
  }),
});
```

### Get Summary (for Charts)
```js
const res = await apiFetch('/tracker/summary');
const {
  totalMoney, totalFood, grandTotal,
  byType,       // [{ type, totalAmount, count }]
  chartData,    // [{ day, type, total }] — plug into Chart.js
  funAnalysis,  // { totalCaloriesGained, caloriesBurned, cricketBatsKuddusCouldBuy, jhalmuriBags }
} = res.data;
```

---

## 7. Mission 5 — SOS Button

### Trigger SOS
```js
await apiFetch('/sos', {
  method: 'POST',
  body: JSON.stringify({
    location: 'CLASSROOM',  // LIBRARY|PLAYGROUND|CORRIDOR|CLASSROOM|CANTEEN
    message: 'Kuddus is threatening me!',
  }),
});
```

### Admin: Get Active Alerts
```js
const res = await apiFetch('/sos/active');
const alerts = res.data;
```

### Admin: Resolve Alert
```js
await apiFetch(`/sos/${alertId}/resolve`, { method: 'PATCH' });
```

---

## 8. Real-Time SOS with Socket.IO

```bash
npm install socket.io-client
```

```js
import { io } from 'socket.io-client';

const socket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000');

// Admin dashboard joins admin room
socket.emit('join:admin');

// New SOS arrives
socket.on('sos:new', (alert) => {
  // { id, location, message, reportedBy, createdAt }
  showToast(`🚨 SOS from ${alert.location}!`);
  refreshAlerts();
});

// Alert resolved
socket.on('sos:resolved', ({ id }) => {
  removeAlertFromList(id);
});

// Cleanup
useEffect(() => () => socket.disconnect(), []);
```

---

## 9. Complete API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | ❌ | Register |
| POST | `/auth/login` | ❌ | Login → JWT |
| GET | `/auth/me` | ✅ | Current user |
| POST | `/complaints` | ❌ | Submit complaint |
| POST | `/complaints/:id/image` | ✅ | Upload image |
| GET | `/complaints` | 🔑 | List all |
| GET | `/complaints/dashboard` | 🔑 | Warning stats |
| GET | `/complaints/:id` | ✅ | Single complaint |
| PATCH | `/complaints/:id/status` | 🔑 | Update status |
| PATCH | `/complaints/:id/warn` | 🔑 | Add warning |
| DELETE | `/complaints/:id` | 🔑 | Delete |
| POST | `/seats/plan` | 🔑 | Generate plan |
| GET | `/seats` | ✅ | Latest plan |
| GET | `/seats/:planId` | ✅ | Specific plan |
| GET | `/seats/all/plans` | 🔑 | List plans |
| DELETE | `/seats/:planId` | 🔑 | Delete plan |
| POST | `/tracker` | ✅ | Add entry |
| GET | `/tracker` | ✅ | List entries |
| GET | `/tracker/summary` | ✅ | Summary + charts |
| GET | `/tracker/:id` | ✅ | Single entry |
| DELETE | `/tracker/:id` | 🔑 | Delete entry |
| POST | `/sos` | ✅ | 🚨 Trigger SOS |
| GET | `/sos/active` | 🔑 | Active alerts |
| GET | `/sos` | 🔑 | All alerts |
| PATCH | `/sos/:id/resolve` | 🔑 | Resolve alert |

> **Legend**: ❌ No auth | ✅ JWT required | 🔑 Admin JWT required

---

## 10. Deployment to Railway (Free)

1. Push backend to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Set env vars in Railway dashboard:
   - `DATABASE_URL` = your Aiven PostgreSQL URL with `?sslmode=require`
   - `JWT_SECRET` = a random 64-char string
   - `FRONTEND_URL` = your Vercel URL
   - `NODE_ENV` = production
4. Railway auto-detects Node and runs `npm start`
5. Run migrations: `npx prisma db push --schema=db/schema.prisma` (from Railway shell)
6. Update React `.env`: `REACT_APP_API_URL=https://your-app.railway.app/api/v1`
