import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel, Chip, Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Assignment as AssignmentIcon } from '@mui/icons-material';
import AxiosInstance from '../Axios';

const statusColors = {
  pending: 'warning',
  approved: 'success',
  rejected: 'error',
  withdrawn: 'default',
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  status: 'pending',
  notes: '',
};

export default function Applicants({ property }) {
  const [applicants, setApplicants] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingApplicant, setEditingApplicant] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchApplicants = () => {
    AxiosInstance.get(`/project/${property.id}/applicants/`)
      .then(res => setApplicants(res.data))
      .catch(() => showSnackbar('Failed to load applicants', 'error'));
  };

  useEffect(() => {
    fetchApplicants();
  }, [property.id]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => {
    setEditingApplicant(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (applicant) => {
    setEditingApplicant(applicant);
    setForm({
      name: applicant.name || '',
      email: applicant.email || '',
      phone: applicant.phone || '',
      status: applicant.status || 'pending',
      notes: applicant.notes || '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingApplicant(null);
    setForm(emptyForm);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      showSnackbar('Name is required', 'error');
      return;
    }
    const request = editingApplicant
      ? AxiosInstance.patch(`/project/${property.id}/applicants/${editingApplicant.id}/`, form)
      : AxiosInstance.post(`/project/${property.id}/applicants/`, form);

    request
      .then(() => {
        fetchApplicants();
        handleCloseDialog();
        showSnackbar(editingApplicant ? 'Applicant updated' : 'Applicant added');
      })
      .catch(() => showSnackbar('Failed to save applicant', 'error'));
  };

  const handleDeletePrompt = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    AxiosInstance.delete(`/project/${property.id}/applicants/${deletingId}/`)
      .then(() => {
        fetchApplicants();
        showSnackbar('Applicant deleted');
      })
      .catch(() => showSnackbar('Failed to delete applicant', 'error'))
      .finally(() => {
        setDeleteDialogOpen(false);
        setDeletingId(null);
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Rental Applications</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Applicant
        </Button>
      </Box>

      {applicants.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No applicants yet</Typography>
            <Typography variant="body2" color="text.disabled">Add an applicant to get started</Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Applied</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applicants.map(applicant => (
                <TableRow key={applicant.id} hover>
                  <TableCell>{applicant.name}</TableCell>
                  <TableCell>{applicant.email || '—'}</TableCell>
                  <TableCell>{applicant.phone || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={applicant.status}
                      color={statusColors[applicant.status] || 'default'}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell>
                    {applicant.application_date
                      ? new Date(applicant.application_date).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(applicant)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeletePrompt(applicant.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingApplicant ? 'Edit Applicant' : 'Add Applicant'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
          />
          <TextField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="withdrawn">Withdrawn</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Notes"
            name="notes"
            value={form.notes}
            onChange={handleChange}
            fullWidth
            multiline
            minRows={3}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingApplicant ? 'Save Changes' : 'Add Applicant'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Applicant</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this applicant? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDeleteConfirm}>Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
