// PropertyDetail - Individual property workspace with submenu navigation
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
  Breadcrumbs,
  IconButton,
  Chip
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Home as HomeIcon,
  Description as DocsIcon,
  Gavel as LegalIcon,
  People as TenantsIcon,
  PersonSearch as ApplicantsIcon,
  Kitchen as AppliancesIcon,
  Build as MaintenanceIcon,
  Assessment as AnalyticsIcon,
  AccountBalance as FinancialIcon
} from '@mui/icons-material';
import AxiosInstance from './Axios';

// Import property section components (we'll create these)
import PropertyOverview from './property-sections/PropertyOverview';
import LegalDocuments from './property-sections/LegalDocuments';
import CurrentTenants from './property-sections/CurrentTenants';
import PastTenants from './property-sections/PastTenants';
import Applicants from './property-sections/Applicants';
import Appliances from './property-sections/Appliances';
import Maintenance from './property-sections/Maintenance';
import Analytics from './property-sections/Analytics';

const PropertyDetail = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get current tab from URL path
  const currentPath = location.pathname.split('/').pop();
  const [currentTab, setCurrentTab] = useState(currentPath || 'overview');

  // Property sections configuration
  const propertySections = [
    { id: 'overview', label: 'Overview', icon: <HomeIcon />, path: 'overview' },
    { id: 'legal', label: 'Legal Docs', icon: <LegalIcon />, path: 'legal' },
    { id: 'current-tenants', label: 'Current Tenants', icon: <TenantsIcon />, path: 'current-tenants' },
    { id: 'past-tenants', label: 'Past Tenants', icon: <TenantsIcon />, path: 'past-tenants' },
    { id: 'applicants', label: 'Applicants', icon: <ApplicantsIcon />, path: 'applicants' },
    { id: 'appliances', label: 'Appliances', icon: <AppliancesIcon />, path: 'appliances' },
    { id: 'maintenance', label: 'Maintenance', icon: <MaintenanceIcon />, path: 'maintenance' },
    { id: 'analytics', label: 'Analytics', icon: <AnalyticsIcon />, path: 'analytics' }
  ];

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await AxiosInstance.get(`/project/${propertyId}/`);
        setProperty(response.data);
      } catch (error) {
        console.error('Error fetching property:', error);
        navigate('/projects'); // Redirect if property not found
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, navigate]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    navigate(`/property/${propertyId}/${newValue}`);
  };

  // Get status color for property
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'open': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" color="text.secondary">
          Loading property details...
        </Typography>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Property not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header with Breadcrumbs and Property Info */}
      <Box sx={{ mb: 3 }}>
        {/* Back Button and Breadcrumbs */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <IconButton 
            onClick={() => navigate('/projects')} 
            sx={{ mr: 2 }}
          >
            <BackIcon />
          </IconButton>
          <Breadcrumbs>
            <Link 
              to="/projects" 
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              My Properties
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {property.name}
            </Typography>
          </Breadcrumbs>
        </Box>

        {/* Property Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <HomeIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {property.name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Chip 
                label={property.status} 
                color={getStatusColor(property.status)}
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                Property ID: {property.id}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Property Sections Navigation */}
      <Paper sx={{ mb: 3, overflow: 'hidden' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            minHeight: 48,
            '& .MuiTabs-scrollButtons': { width: 32 },
          }}
        >
          {propertySections.map((section) => (
            <Tab
              key={section.id}
              value={section.path}
              label={section.label}
              icon={section.icon}
              iconPosition="start"
              sx={{
                minHeight: 48,
                minWidth: 'auto',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '0.8rem',
                px: 1.5,
                py: 0,
                '& .MuiTab-iconWrapper': { fontSize: '1rem', mr: 0.5 },
              }}
            />
          ))}
        </Tabs>
      </Paper>

      {/* Property Section Content */}
      <Routes>
        <Route path="overview" element={<PropertyOverview property={property} />} />
        <Route path="legal" element={<LegalDocuments property={property} />} />
        <Route path="current-tenants" element={<CurrentTenants property={property} />} />
        <Route path="past-tenants" element={<PastTenants property={property} />} />
        <Route path="applicants" element={<Applicants property={property} />} />
        <Route path="appliances" element={<Appliances property={property} />} />
        <Route path="maintenance" element={<Maintenance property={property} />} />
        <Route path="analytics" element={<Analytics property={property} />} />
        {/* Default route */}
        <Route path="" element={<PropertyOverview property={property} />} />
      </Routes>
    </Container>
  );
};

export default PropertyDetail;