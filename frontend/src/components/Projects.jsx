// Projects Component - Dual-view property dashboard (List & Tile views)
import { React, useEffect, useMemo, useState } from "react";
import AxiosInstance from "./Axios";
import { MaterialReactTable } from "material-react-table";
import Dayjs from "dayjs";
import { 
  Box, 
  IconButton, 
  Typography, 
  ToggleButtonGroup, 
  ToggleButton,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Button,
  Container
} from "@mui/material";
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  ViewList as ListIcon,
  ViewModule as TileIcon,
  Home as PropertyIcon,
  CalendarToday as DateIcon,
  Person as ManagerIcon
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const Projects = () => {
  const [myData, setMyData] = useState();
  const [loading, setLoading] = useState(true);
  // View toggle state - 'list' or 'tile'
  const [viewMode, setViewMode] = useState('tile');

  const GetData = () => {
    AxiosInstance.get(`project/`).then((res) => {
      setMyData(res.data);
      console.log(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    GetData();
  }, []);

  // Handle view mode toggle
  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  // Get status color for chips
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in progress': return 'warning';
      case 'open': return 'info';
      default: return 'default';
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 150,
      },
      {
        accessorFn: (row) => Dayjs(row.start_date).format("DD-MM-YYYY"),
        header: "Start date",
        size: 200,
      },
      {
        accessorFn: (row) => Dayjs(row.end_date).format("DD-MM-YYYY"),
        header: "End date",
        size: 150,
      },
      {
        accessorKey: "comments",
        header: "Comments",
        size: 150,
      },
    ],
    []
  );

  // Tile View Component - Property cards
  const TileView = ({ properties }) => (
    <Grid container spacing={3}>
      {properties.map((property) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={property.id}>
          <Card sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
            }
          }}>
            <CardContent sx={{ flexGrow: 1 }}>
              {/* Property Icon & Name */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PropertyIcon sx={{ fontSize: 32, color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" component="h3" sx={{ fontWeight: 600 }}>
                  {property.name}
                </Typography>
              </Box>

              {/* Status Chip */}
              <Box sx={{ mb: 2 }}>
                <Chip 
                  label={property.status} 
                  color={getStatusColor(property.status)}
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>

              {/* Project Details */}
              <Box sx={{ mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <DateIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Start: {Dayjs(property.start_date).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <DateIcon sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    End: {Dayjs(property.end_date).format("MMM DD, YYYY")}
                  </Typography>
                </Box>
              </Box>

              {/* Comments - Always reserve space for consistent card heights */}
              <Box sx={{ minHeight: 40, display: 'flex', alignItems: 'flex-start' }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {property.comments || ''}
                </Typography>
              </Box>
            </CardContent>

            {/* Action Buttons */}
            <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
              <Button
                variant="contained"
                size="small"
                component={Link}
                to={`/property/${property.id}/overview`}
                startIcon={<PropertyIcon />}
                sx={{ borderRadius: 2 }}
              >
                View Property
              </Button>
              <Box>
                <IconButton
                  color="secondary"
                  component={Link}
                  to={`/edit/${property.id}`}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  component={Link}
                  to={`/delete/${property.id}`}
                  size="small"
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header Section with View Toggle */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            🏠 My Properties
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and track all your rental properties
          </Typography>
        </Box>

        {/* View Toggle Buttons */}
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
          sx={{ bgcolor: 'background.paper', boxShadow: 1, borderRadius: 2 }}
        >
          <ToggleButton value="tile" aria-label="tile view">
            <TileIcon />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ListIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>
      
      {/* Loading State */}
      {loading ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading your properties...
          </Typography>
        </Box>
      ) : (
        /* Conditional View Rendering */
        <>
          {viewMode === 'tile' ? (
            /* Tile View */
            myData && myData.length > 0 ? (
              <TileView properties={myData} />
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <PropertyIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No properties found
                </Typography>
                <Button 
                  variant="contained" 
                  component={Link} 
                  to="/create"
                  sx={{ mt: 2 }}
                >
                  Add Your First Property
                </Button>
              </Box>
            )
          ) : (
            /* List View */
            <Box sx={{ 
              bgcolor: 'background.paper', 
              borderRadius: 2, 
              overflow: 'hidden',
              boxShadow: 1
            }}>
              <MaterialReactTable
                columns={columns}
                data={myData || []}
                enableRowActions
                renderRowActions={({ row }) => (
                  <Box sx={{ display: "flex", flexWrap: "nowrap", gap: "8px" }}>
                    <IconButton
                      color="secondary"
                      component={Link}
                      to={`/edit/${row.original.id}`}
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      component={Link}
                      to={`/delete/${row.original.id}`}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Projects;