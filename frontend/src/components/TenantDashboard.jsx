import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Chip, Grid, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  Alert, Snackbar, CircularProgress
} from '@mui/material';
import {
  Home as HomeIcon,
  Build as BuildIcon,
  Add as AddIcon,
  AttachFile as AttachIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import AxiosInstance from './Axios';
import TenantPaymentPortal from './TenantPaymentPortal';

const priorityConfig = {
  low:       { label: 'Low',       color: 'default' },
  medium:    { label: 'Medium',    color: 'info'    },
  high:      { label: 'High',      color: 'warning' },
  emergency: { label: 'Emergency', color: 'error'   },
};

const statusConfig = {
  open:        { label: 'Open',        color: 'warning' },
  in_progress: { label: 'In Progress', color: 'info'    },
  completed:   { label: 'Completed',   color: 'success' },
  cancelled:   { label: 'Cancelled',   color: 'default' },
};

// ── Rent Info page ──
function RentInfo({ data }) {
  if (!data) return <CircularProgress />;

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Rent Info</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">Property</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>
                {data.property || '—'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">Monthly Rent</Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mt: 0.5 }}>
                {data.rent_amount ? `$${parseFloat(data.rent_amount).toLocaleString()}` : '—'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">Lease Start</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>{data.lease_start || '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="overline" color="text.secondary">Lease End</Typography>
              <Typography variant="h6" sx={{ fontWeight: 600, mt: 0.5 }}>{data.lease_end || '—'}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

// ── Maintenance page ──
function TenantMaintenance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', priority: 'medium' });
  const [photo, setPhoto] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchRequests = async () => {
    try {
      const res = await AxiosInstance.get('/api/tenant/maintenance/');
      setRequests(res.data);
    } catch {
      showSnackbar('Failed to load requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      showSnackbar('Title and description are required', 'error');
      return;
    }
    setSubmitting(true);
    try {
      const payload = new FormData();
      payload.append('title', form.title);
      payload.append('description', form.description);
      payload.append('priority', form.priority);
      if (photo) payload.append('photo', photo);

      await AxiosInstance.post('/api/tenant/maintenance/', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      showSnackbar('Request submitted', 'success');
      setDialogOpen(false);
      setForm({ title: '', description: '', priority: 'medium' });
      setPhoto(null);
      fetchRequests();
    } catch {
      showSnackbar('Failed to submit request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Maintenance Requests</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
          Submit Request
        </Button>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <BuildIcon sx={{ fontSize: 56, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No requests yet</Typography>
              <Typography variant="body2" color="text.secondary">Submit a request and your landlord will be notified</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Priority</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Photo</TableCell>
                    <TableCell>Submitted</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((r) => (
                    <TableRow key={r.id} hover>
                      <TableCell sx={{ fontWeight: 600 }}>{r.title}</TableCell>
                      <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {r.description || '—'}
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={priorityConfig[r.priority]?.label || r.priority} color={priorityConfig[r.priority]?.color || 'default'} />
                      </TableCell>
                      <TableCell>
                        <Chip size="small" label={statusConfig[r.status]?.label || r.status} color={statusConfig[r.status]?.color || 'default'} />
                      </TableCell>
                      <TableCell>
                        {r.photo
                          ? <a href={r.photo} target="_blank" rel="noreferrer"><AttachIcon fontSize="small" /></a>
                          : '—'}
                      </TableCell>
                      <TableCell>{r.created_date ? new Date(r.created_date).toLocaleDateString() : '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Submit dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Submit Maintenance Request</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              required
              label="Title"
              placeholder="e.g. Leaking faucet in bathroom"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              fullWidth
            />
            <TextField
              required
              label="Description"
              placeholder="Describe the issue in detail..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              multiline
              rows={4}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                label="Priority"
              >
                <MenuItem value="low">Low — not urgent</MenuItem>
                <MenuItem value="medium">Medium — needs attention</MenuItem>
                <MenuItem value="high">High — affecting daily use</MenuItem>
                <MenuItem value="emergency">Emergency — safety issue</MenuItem>
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Photo (optional)
              </Typography>
              <Button variant="outlined" component="label" startIcon={<AttachIcon />} size="small">
                {photo ? photo.name : 'Attach Photo'}
                <input type="file" accept="image/*" hidden onChange={e => setPhoto(e.target.files[0] || null)} />
              </Button>
              {photo && (
                <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                  {(photo.size / 1024).toFixed(0)} KB
                </Typography>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDialogOpen(false); setPhoto(null); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(s => ({ ...s, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}

// ── Root TenantDashboard ──
const TenantDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);

  useEffect(() => {
    AxiosInstance.get('/api/tenant/dashboard/').then(res => setData(res.data)).catch(() => {});
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Hello, {user?.username}!
        </Typography>
        <Chip label="Tenant Portal" color="primary" size="small" sx={{ mt: 1 }} />
      </Box>

      <Routes>
        <Route path="/" element={<RentInfo data={data} />} />
        <Route path="maintenance" element={<TenantMaintenance />} />
        <Route path="payments" element={<TenantPaymentPortal />} />
      </Routes>
    </Box>
  );
};

export default TenantDashboard;
