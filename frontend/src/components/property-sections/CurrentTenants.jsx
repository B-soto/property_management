import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Chip, IconButton, Alert,
  Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';
import {
  People as TenantsIcon, Add as AddIcon, Delete as DeleteIcon,
  Edit as EditIcon, VpnKey as LoginIcon, CheckCircle as ActiveIcon
} from '@mui/icons-material';
import AxiosInstance from '../Axios';

const emptyForm = { name: '', email: '', phone: '', lease_start: '', lease_end: '', rent_amount: '', notes: '' };
const emptyLoginForm = { username: '', password: '' };

const CurrentTenants = ({ property }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginTenant, setLoginTenant] = useState(null);
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [loginLoading, setLoginLoading] = useState(false);

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
      showSnackbar(err.response?.data ? JSON.stringify(err.response.data) : 'Error saving tenant', 'error');
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

  const openLoginDialog = (tenant) => {
    setLoginTenant(tenant);
    setLoginForm(emptyLoginForm);
    setLoginDialogOpen(true);
  };

  const handleCreateLogin = async () => {
    setLoginLoading(true);
    try {
      await AxiosInstance.post(`/project/${property.id}/tenants/${loginTenant.id}/create-login/`, loginForm);
      showSnackbar(`Login created for ${loginTenant.name}`, 'success');
      setLoginDialogOpen(false);
      fetchTenants();
    } catch (err) {
      showSnackbar(err.response?.data?.error || 'Error creating login', 'error');
    } finally {
      setLoginLoading(false);
    }
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
                    <TableCell>Portal</TableCell>
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
                      <TableCell>
                        {t.has_login ? (
                          <Chip icon={<ActiveIcon />} label="Login Active" color="success" size="small" />
                        ) : (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<LoginIcon />}
                            onClick={() => openLoginDialog(t)}
                            sx={{ fontSize: '0.75rem' }}
                          >
                            Create Login
                          </Button>
                        )}
                      </TableCell>
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

      {/* Add / Edit Tenant Dialog */}
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

      {/* Create Login Dialog */}
      <Dialog open={loginDialogOpen} onClose={() => setLoginDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Create Login for {loginTenant?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            This will create a tenant portal account. Share these credentials with your tenant.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              required
              label="Username"
              value={loginForm.username}
              onChange={e => setLoginForm({ ...loginForm, username: e.target.value })}
              autoComplete="off"
            />
            <TextField
              required
              label="Password"
              type="password"
              value={loginForm.password}
              onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
              autoComplete="new-password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateLogin}
            disabled={!loginForm.username || !loginForm.password || loginLoading}
          >
            {loginLoading ? 'Creating...' : 'Create Login'}
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
