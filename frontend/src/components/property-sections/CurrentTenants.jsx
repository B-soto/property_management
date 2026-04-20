import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import { People as TenantsIcon, Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import AxiosInstance from '../Axios';

const emptyForm = { name: '', email: '', phone: '', lease_start: '', lease_end: '', rent_amount: '', notes: '' };

const CurrentTenants = ({ property }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchTenants(); }, [property.id]);

  const fetchTenants = async () => {
    try {
      const res = await AxiosInstance.get(`/project/${property.id}/tenants/?is_current=true`);
      setTenants(res.data);
    } catch { showSnackbar('Error loading tenants', 'error'); }
    finally { setLoading(false); }
  };

  const handleOpen = (tenant = null) => {
    setEditingTenant(tenant);
    setForm(tenant ? {
      name: tenant.name, email: tenant.email || '', phone: tenant.phone || '',
      lease_start: tenant.lease_start, lease_end: tenant.lease_end,
      rent_amount: tenant.rent_amount || '', notes: tenant.notes || ''
    } : emptyForm);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editingTenant) {
        await AxiosInstance.patch(`/project/${property.id}/tenants/${editingTenant.id}/`, form);
        showSnackbar('Tenant updated', 'success');
      } else {
        await AxiosInstance.post(`/project/${property.id}/tenants/`, { ...form, is_current: true });
        showSnackbar('Tenant added', 'success');
      }
      setDialogOpen(false);
      fetchTenants();
    } catch (err) {
      const msg = err.response?.data ? JSON.stringify(err.response.data) : 'Error saving tenant';
      console.error('Tenant save error:', err.response?.data);
      showSnackbar(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this tenant?')) return;
    try {
      await AxiosInstance.delete(`/project/${property.id}/tenants/${id}/`);
      showSnackbar('Tenant removed', 'success');
      fetchTenants();
    } catch { showSnackbar('Error removing tenant', 'error'); }
  };

  const showSnackbar = (message, severity) => setSnackbar({ open: true, message, severity });

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Current Tenants</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>Add Tenant</Button>
      </Box>

      <Card>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : tenants.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <TenantsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No current tenants</Typography>
              <Typography variant="body2" color="text.secondary">Add a tenant to get started</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Phone</TableCell>
                    <TableCell>Lease Start</TableCell>
                    <TableCell>Lease End</TableCell>
                    <TableCell>Rent/mo</TableCell>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tenants.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{t.name}</TableCell>
                      <TableCell>{t.email || '—'}</TableCell>
                      <TableCell>{t.phone || '—'}</TableCell>
                      <TableCell>{t.lease_start}</TableCell>
                      <TableCell>{t.lease_end}</TableCell>
                      <TableCell>{t.rent_amount ? `$${t.rent_amount}` : '—'}</TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpen(t)}><EditIcon fontSize="small" /></IconButton>
                        <IconButton size="small" color="error" onClick={() => handleDelete(t.id)}><DeleteIcon fontSize="small" /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTenant ? 'Edit Tenant' : 'Add Tenant'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField required label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            <TextField label="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <TextField required type="date" label="Lease Start" value={form.lease_start} onChange={e => setForm({ ...form, lease_start: e.target.value })} InputLabelProps={{ shrink: true }} />
            <TextField required type="date" label="Lease End" value={form.lease_end} onChange={e => setForm({ ...form, lease_end: e.target.value })} InputLabelProps={{ shrink: true }} />
            <TextField label="Monthly Rent ($)" type="number" value={form.rent_amount} onChange={e => setForm({ ...form, rent_amount: e.target.value })} />
            <TextField label="Notes" multiline rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.lease_start || !form.lease_end}>
            {editingTenant ? 'Save Changes' : 'Add Tenant'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CurrentTenants;
