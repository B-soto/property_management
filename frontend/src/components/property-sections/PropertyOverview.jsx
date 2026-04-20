// PropertyOverview - Main dashboard for individual property
import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Chip
} from '@mui/material';
import {
  Home as PropertyIcon,
  CalendarToday as DateIcon,
  TrendingUp as ProgressIcon,
  AttachMoney as MoneyIcon
} from '@mui/icons-material';
import Dayjs from 'dayjs';

const PropertyOverview = ({ property }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
        📊 Property Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Property Info Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PropertyIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Property Details
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Project Name
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {property.name}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip 
                  label={property.status} 
                  color={property.status?.toLowerCase() === 'completed' ? 'success' : 'warning'}
                  size="small"
                  sx={{ mt: 0.5 }}
                />
              </Box>

              {property.comments && (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Notes
                  </Typography>
                  <Typography variant="body1">
                    {property.comments}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline Card */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DateIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Project Timeline
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Start Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {Dayjs(property.start_date).format("MMM DD, YYYY")}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  End Date
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {Dayjs(property.end_date).format("MMM DD, YYYY")}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Progress
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={property.status === 'Completed' ? 100 : 65} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {property.status === 'Completed' ? '100' : '65'}% Complete
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                🏠 Property Management Hub
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Welcome to your property management dashboard. Use the tabs above to navigate between different sections:
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="📄 Legal Documents" variant="outlined" />
                <Chip label="👥 Tenant Management" variant="outlined" />
                <Chip label="📝 Applications" variant="outlined" />
                <Chip label="🔧 Maintenance" variant="outlined" />
                <Chip label="📊 Analytics" variant="outlined" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PropertyOverview;