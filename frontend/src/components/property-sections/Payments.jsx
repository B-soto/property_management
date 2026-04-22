import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Grid, Button, Chip,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Select, MenuItem, FormControl, InputLabel,
  IconButton, Alert,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Add as AddIcon,
  CheckCircle as PaidIcon,
  Warning as LateIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';

const mockPayments = [
  { id: 1, tenant: 'Maria Gonzalez', amount: 1850.00, due_date: '2026-04-01', paid_date: '2026-04-01', method: 'ACH', status: 'paid' },
  { id: 2, tenant: 'Maria Gonzalez', amount: 1850.00, due_date: '2026-03-01', paid_date: '2026-03-03', method: 'Check', status: 'paid' },
  { id: 3, tenant: 'Maria Gonzalez', amount: 1850.00, due_date: '2026-02-01', paid_date: '2026-02-01', method: 'ACH', status: 'paid' },
  { id: 4, tenant: 'Carlos Rivera', amount: 2100.00, due_date: '2026-04-01', paid_date: null, method: null, status: 'overdue' },
  { id: 5, tenant: 'Carlos Rivera', amount: 2100.00, due_date: '2026-03-01', paid_date: '2026-03-08', method: 'Zelle', status: 'late' },
];

const statusConfig = {
  paid:    { label: 'Paid',    color: 'success' },
  late:    { label: 'Late',    color: 'warning' },
  overdue: { label: 'Overdue', color: 'error'   },
  pending: { label: 'Pending', color: 'default'  },
};

const emptyForm = { tenant: '', amount: '', due_date: '', paid_date: '', method: 'ACH', notes: '' };

const Payments = ({ property }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const collected = mockPayments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const outstanding = mockPayments.filter(p => p.status !== 'paid').reduce((s, p) => s + p.amount, 0);
  const overdueCount = mockPayments.filter(p => p.status === 'overdue').length;

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <Box sx={{ p: 3 }}>
      <Alert severity="info" sx={{ mb: 3 }}>
        Payment processing coming soon. This is a preview of the payment tracking UI.
      </Alert>

      <Grid container spacing={3}>
        {/* Stats */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">Collected (YTD)</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'success.main', mt: 0.5 }}>
                    ${collected.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">Outstanding</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'warning.main', mt: 0.5 }}>
                    ${outstanding.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Card>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography variant="body2" color="text.secondary">Overdue</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main', mt: 0.5 }}>
                    {overdueCount} tenant{overdueCount !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Payment History Table */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>Payment History</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
                  Record Payment
                </Button>
              </Box>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Tenant</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Due</TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Method</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockPayments.map((p) => (
                      <TableRow key={p.id} hover>
                        <TableCell sx={{ fontWeight: 600 }}>{p.tenant}</TableCell>
                        <TableCell>${p.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                        <TableCell>{new Date(p.due_date).toLocaleDateString()}</TableCell>
                        <TableCell>{p.paid_date ? new Date(p.paid_date).toLocaleDateString() : '—'}</TableCell>
                        <TableCell>{p.method || '—'}</TableCell>
                        <TableCell>
                          <Chip
                            size="small"
                            label={statusConfig[p.status]?.label || p.status}
                            color={statusConfig[p.status]?.color || 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Quick Actions</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Button fullWidth variant="outlined" startIcon={<MoneyIcon />} disabled>
                  Send Rent Reminder
                </Button>
                <Button fullWidth variant="outlined" startIcon={<ReceiptIcon />} disabled>
                  Generate Statement
                </Button>
                <Button fullWidth variant="outlined" startIcon={<PaidIcon />} disabled>
                  Auto-Pay Setup
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Upcoming</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { tenant: 'Maria Gonzalez', amount: 1850, due: 'May 1' },
                  { tenant: 'Carlos Rivera', amount: 2100, due: 'May 1' },
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.tenant}</Typography>
                      <Typography variant="caption" color="text.secondary">Due {item.due}</Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                      ${item.amount.toLocaleString()}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Record Payment Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Record Payment</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField label="Tenant" name="tenant" value={form.tenant} onChange={handleChange} fullWidth />
            <TextField label="Amount" name="amount" type="number" value={form.amount} onChange={handleChange} fullWidth inputProps={{ step: '0.01', min: '0' }} />
            <TextField label="Due Date" name="due_date" type="date" value={form.due_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Paid Date" name="paid_date" type="date" value={form.paid_date} onChange={handleChange} fullWidth InputLabelProps={{ shrink: true }} />
            <FormControl fullWidth>
              <InputLabel>Method</InputLabel>
              <Select name="method" value={form.method} onChange={handleChange} label="Method">
                <MenuItem value="ACH">ACH / Bank Transfer</MenuItem>
                <MenuItem value="Check">Check</MenuItem>
                <MenuItem value="Zelle">Zelle</MenuItem>
                <MenuItem value="Venmo">Venmo</MenuItem>
                <MenuItem value="Cash">Cash</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Notes" name="notes" value={form.notes} onChange={handleChange} multiline rows={2} fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" disabled>Save (Coming Soon)</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Payments;
