import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Snackbar, Alert, CircularProgress
} from '@mui/material';
import {
  Build as BuildIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import AxiosInstance from '../Axios';

const priorityConfig = {
  emergency: { label: 'Emergency', color: 'error' },
  high: { label: 'High', color: 'warning' },
  medium: { label: 'Medium', color: 'info' },
  low: { label: 'Low', color: 'default' },
};

const statusConfig = {
  open: { label: 'Open', color: 'warning' },
  in_progress: { label: 'In Progress', color: 'info' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'default' },
};

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  cost: '',
  completed_date: '',
  notes: '',
};

const Maintenance = ({ property }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const baseUrl = `/project/${property.id}/maintenance/`;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AxiosInstance.get(baseUrl);
      setRequests(res.data);
    } catch {
      showSnackbar('Failed to load maintenance requests', 'error');
    } finally {
      setLoading(false);
    }
  }, [baseUrl]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (req) => {
    setEditingId(req.id);
    setForm({
      title: req.title || '',
      description: req.description || '',
      priority: req.priority || 'medium',
      status: req.status || 'open',
      cost: req.cost || '',
      completed_date: req.completed_date || '',
      notes: req.notes || '',
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      showSnackbar('Title is required', 'error');
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      cost: form.cost === '' ? null : form.cost,
      completed_date: form.completed_date === '' ? null : form.completed_date,
    };
    try {
      if (editingId) {
        await AxiosInstance.patch(`${baseUrl}${editingId}/`, payload);
        showSnackbar('Work order updated');
      } else {
        await AxiosInstance.post(baseUrl, payload);
        showSnackbar('Work order created');
      }
      handleClose();
      fetchRequests();
    } catch {
      showSnackbar('Failed to save work order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this work order?')) return;
    try {
      await AxiosInstance.delete(`${baseUrl}${id}/`);
      showSnackbar('Work order deleted');
      fetchRequests();
    } catch {
      showSnackbar('Failed to delete work order', 'error');
    }
  };

  const openCount = requests.filter((r) => r.status === 'open').length;
  const completedCount = requests.filter((r) => r.status === 'completed').length;
  const totalCost = requests
    .filter((r) => r.status === 'completed' && r.cost)
    .reduce((sum, r) => sum + parseFloat(r.cost), 0);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Work Orders
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
                  Create Work Order
                </Button>
              </Box>

              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : requests.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <BuildIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    No maintenance requests
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track maintenance requests, repairs, and property improvements
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Priority</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Cost</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requests.map((req) => (
                        <TableRow key={req.id} hover>
                          <TableCell>{req.title}</TableCell>
                          <TableCell>
                            <Chip
                              label={priorityConfig[req.priority]?.label || req.priority}
                              color={priorityConfig[req.priority]?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={statusConfig[req.status]?.label || req.status}
                              color={statusConfig[req.status]?.color || 'default'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>
                            {req.cost != null ? `$${parseFloat(req.cost).toLocaleString()}` : '—'}
                          </TableCell>
                          <TableCell>
                            {req.created_date ? new Date(req.created_date).toLocaleDateString() : '—'}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton size="small" onClick={() => openEdit(req)}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="error" onClick={() => handleDelete(req.id)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Maintenance Stats
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">Open Requests</Typography>
                <Typography variant="h4" color="warning.main">{openCount}</Typography>
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">Completed</Typography>
                <Typography variant="h4" color="success.main">{completedCount}</Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">Total Cost (Completed)</Typography>
                <Typography variant="h4" color="info.main">
                  ${totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Work Order' : 'Create Work Order'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Priority</InputLabel>
              <Select name="priority" value={form.priority} onChange={handleChange} label="Priority">
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
                <MenuItem value="emergency">Emergency</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select name="status" value={form.status} onChange={handleChange} label="Status">
                <MenuItem value="open">Open</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Cost"
              name="cost"
              type="number"
              value={form.cost}
              onChange={handleChange}
              fullWidth
              inputProps={{ step: '0.01', min: '0' }}
            />
            <TextField
              label="Completed Date"
              name="completed_date"
              type="date"
              value={form.completed_date}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={submitting}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {submitting ? <CircularProgress size={20} /> : editingId ? 'Save' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Maintenance;
