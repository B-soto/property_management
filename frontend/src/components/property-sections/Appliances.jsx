import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, IconButton, Alert, Snackbar,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Select, MenuItem, FormControl, InputLabel, Chip, Paper
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon, Edit as EditIcon, Kitchen as KitchenIcon } from '@mui/icons-material';
import AxiosInstance from '../Axios';

const statusColors = {
  working: 'success',
  needs_repair: 'warning',
  replaced: 'default',
};

const statusLabels = {
  working: 'Working',
  needs_repair: 'Needs Repair',
  replaced: 'Replaced',
};

const emptyForm = {
  name: '',
  brand: '',
  model_number: '',
  purchase_date: '',
  warranty_expiry: '',
  status: 'working',
  notes: '',
};

export default function Appliances({ property }) {
  const [appliances, setAppliances] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchAppliances = () => {
    AxiosInstance.get(`/project/${property.id}/appliances/`)
      .then(res => setAppliances(res.data))
      .catch(() => showSnackbar('Failed to load appliances', 'error'));
  };

  useEffect(() => {
    fetchAppliances();
  }, [property.id]);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenAdd = () => {
    setEditingAppliance(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (appliance) => {
    setEditingAppliance(appliance);
    setForm({
      name: appliance.name || '',
      brand: appliance.brand || '',
      model_number: appliance.model_number || '',
      purchase_date: appliance.purchase_date || '',
      warranty_expiry: appliance.warranty_expiry || '',
      status: appliance.status || 'working',
      notes: appliance.notes || '',
    });
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingAppliance(null);
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
    const payload = { ...form };
    if (!payload.purchase_date) delete payload.purchase_date;
    if (!payload.warranty_expiry) delete payload.warranty_expiry;

    const request = editingAppliance
      ? AxiosInstance.patch(`/project/${property.id}/appliances/${editingAppliance.id}/`, payload)
      : AxiosInstance.post(`/project/${property.id}/appliances/`, payload);

    request
      .then(() => {
        fetchAppliances();
        handleCloseDialog();
        showSnackbar(editingAppliance ? 'Appliance updated' : 'Appliance added');
      })
      .catch(() => showSnackbar('Failed to save appliance', 'error'));
  };

  const handleDeletePrompt = (id) => {
    setDeletingId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    AxiosInstance.delete(`/project/${property.id}/appliances/${deletingId}/`)
      .then(() => {
        fetchAppliances();
        showSnackbar('Appliance deleted');
      })
      .catch(() => showSnackbar('Failed to delete appliance', 'error'))
      .finally(() => {
        setDeleteDialogOpen(false);
        setDeletingId(null);
      });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>Appliances & Inventory</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd}>
          Add Appliance
        </Button>
      </Box>

      {appliances.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <KitchenIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">No appliances yet</Typography>
            <Typography variant="body2" color="text.disabled">Add an appliance to track your inventory</Typography>
          </CardContent>
        </Card>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Brand</TableCell>
                <TableCell>Model #</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Warranty Expires</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appliances.map(appliance => (
                <TableRow key={appliance.id} hover>
                  <TableCell>{appliance.name}</TableCell>
                  <TableCell>{appliance.brand || '—'}</TableCell>
                  <TableCell>{appliance.model_number || '—'}</TableCell>
                  <TableCell>
                    <Chip
                      label={statusLabels[appliance.status] || appliance.status}
                      color={statusColors[appliance.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {appliance.warranty_expiry
                      ? new Date(appliance.warranty_expiry).toLocaleDateString()
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton size="small" onClick={() => handleOpenEdit(appliance)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeletePrompt(appliance.id)}>
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
        <DialogTitle>{editingAppliance ? 'Edit Appliance' : 'Add Appliance'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            fullWidth
            placeholder="e.g. Refrigerator"
          />
          <TextField
            label="Brand"
            name="brand"
            value={form.brand}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Model Number"
            name="model_number"
            value={form.model_number}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Purchase Date"
            name="purchase_date"
            type="date"
            value={form.purchase_date}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Warranty Expiry"
            name="warranty_expiry"
            type="date"
            value={form.warranty_expiry}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={form.status}
              label="Status"
              onChange={handleChange}
            >
              <MenuItem value="working">Working</MenuItem>
              <MenuItem value="needs_repair">Needs Repair</MenuItem>
              <MenuItem value="replaced">Replaced</MenuItem>
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
            {editingAppliance ? 'Save Changes' : 'Add Appliance'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Appliance</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this appliance? This action cannot be undone.</Typography>
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
