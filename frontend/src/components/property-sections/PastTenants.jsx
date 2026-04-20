import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Alert, Snackbar
} from '@mui/material';
import { PersonSearch } from '@mui/icons-material';
import AxiosInstance from '../Axios';

const PastTenants = ({ property }) => {
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await AxiosInstance.get(`/project/${property.id}/tenants/?is_current=false`);
        setTenants(res.data);
      } catch { setSnackbar({ open: true, message: 'Error loading past tenants', severity: 'error' }); }
      finally { setLoading(false); }
    };
    fetch();
  }, [property.id]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>Past Tenants</Typography>
      <Card>
        <CardContent>
          {loading ? (
            <Typography color="text.secondary">Loading...</Typography>
          ) : tenants.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <PersonSearch sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">No past tenant records</Typography>
              <Typography variant="body2" color="text.secondary">
                Tenants moved out will appear here. Mark a current tenant as inactive to move them here.
              </Typography>
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
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PastTenants;
