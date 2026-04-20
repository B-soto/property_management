import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Card, CardContent, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress
} from '@mui/material';
import AxiosInstance from '../Axios';

const StatCard = ({ label, value, color }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="h3" color={color} sx={{ fontWeight: 700 }}>
        {value}
      </Typography>
    </CardContent>
  </Card>
);

const Analytics = ({ property }) => {
  const [currentTenants, setCurrentTenants] = useState([]);
  const [pastTenants, setPastTenants] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [currentRes, pastRes, maintenanceRes, applicantsRes] = await Promise.all([
        AxiosInstance.get(`/project/${property.id}/tenants/?is_current=true`),
        AxiosInstance.get(`/project/${property.id}/tenants/?is_current=false`),
        AxiosInstance.get(`/project/${property.id}/maintenance/`),
        AxiosInstance.get(`/project/${property.id}/applicants/`),
      ]);
      setCurrentTenants(currentRes.data);
      setPastTenants(pastRes.data);
      setMaintenance(maintenanceRes.data);
      setApplicants(applicantsRes.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [property.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const openMaintenanceCount = maintenance.filter((r) => r.status === 'open').length;

  const pendingApplicantsCount = applicants.filter(
    (a) => a.status === 'pending' || !a.status
  ).length;

  const monthlyRentIncome = currentTenants.reduce((sum, t) => {
    const amount = parseFloat(t.rent_amount || 0);
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);

  const maintenanceCost = maintenance
    .filter((r) => r.status === 'completed' && r.cost)
    .reduce((sum, r) => {
      const cost = parseFloat(r.cost);
      return sum + (isNaN(cost) ? 0 : cost);
    }, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + 90);

  const upcomingExpirations = currentTenants
    .filter((t) => {
      if (!t.lease_end) return false;
      const end = new Date(t.lease_end);
      return end >= today && end <= cutoff;
    })
    .map((t) => {
      const end = new Date(t.lease_end);
      const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
      return { ...t, daysRemaining };
    })
    .sort((a, b) => a.daysRemaining - b.daysRemaining);

  const formatMoney = (amount) =>
    `$${amount.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Property Analytics
      </Typography>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Current Tenants"
            value={currentTenants.length}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Past Tenants"
            value={pastTenants.length}
            color="primary.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Open Maintenance Requests"
            value={openMaintenanceCount}
            color="warning.main"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            label="Pending Applicants"
            value={pendingApplicantsCount}
            color="info.main"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Monthly Rent Income
              </Typography>
              <Typography variant="h3" color="success.main" sx={{ fontWeight: 700 }}>
                {formatMoney(monthlyRentIncome)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Maintenance Cost (Completed)
              </Typography>
              <Typography variant="h3" color="warning.main" sx={{ fontWeight: 700 }}>
                {formatMoney(maintenanceCost)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Upcoming Lease Expirations (Next 90 Days)
              </Typography>
              {upcomingExpirations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No upcoming expirations
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tenant Name</TableCell>
                        <TableCell>Lease End</TableCell>
                        <TableCell>Days Remaining</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {upcomingExpirations.map((t) => (
                        <TableRow key={t.id} hover>
                          <TableCell>
                            {t.first_name || t.last_name
                              ? `${t.first_name || ''} ${t.last_name || ''}`.trim()
                              : t.name || '—'}
                          </TableCell>
                          <TableCell>
                            {new Date(t.lease_end).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{t.daysRemaining}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Analytics;
