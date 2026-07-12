// Backend AI proxy (Mission 3 / general). Distinct from `aiApi.js` which
// talks directly to the external Anti-Kuddus service.
import api from './api.js';

export const aiComplete = (payload) => api.post('/ai/complete', payload).then((r) => r.data);
