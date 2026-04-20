// LegalDocuments - FURY MODE Legal documentation management! 🔥💪
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Alert,
  Snackbar,
  Paper
} from '@mui/material';
import {
  Gavel as LegalIcon,
  Add as AddIcon,
  Description as DocIcon,
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import AxiosInstance from '../Axios';

const LegalDocuments = ({ property }) => {
  // FURY STATE MANAGEMENT! 💪
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadData, setUploadData] = useState({
    document_type: '',
    title: '',
    description: '',
    expiry_date: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Document type options
  const documentTypes = [
    { value: 'lease', label: 'Lease Agreement' },
    { value: 'deed', label: 'Property Deed' },
    { value: 'insurance', label: 'Insurance Policy' },
    { value: 'inspection', label: 'Inspection Report' },
    { value: 'permit', label: 'Building Permit' },
    { value: 'contract', label: 'Service Contract' },
    { value: 'other', label: 'Other Document' }
  ];

  // FURY MODE: Load documents on component mount! 🔥
  useEffect(() => {
    fetchDocuments();
  }, [property.id]);

  const fetchDocuments = async () => {
    try {
      const response = await AxiosInstance.get(`/project/${property.id}/legal-documents/`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
      showSnackbar('Error loading documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  // FURY MODE: Handle file upload! 💪
  const handleFileUpload = async () => {
    if (!selectedFile || !uploadData.title || !uploadData.document_type) {
      showSnackbar('Please fill in all required fields', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', uploadData.title);
    formData.append('document_type', uploadData.document_type);
    formData.append('description', uploadData.description);
    if (uploadData.expiry_date) {
      formData.append('expiry_date', uploadData.expiry_date);
    }

    try {
      await AxiosInstance.post(`/project/${property.id}/legal-documents/`, formData);
      
      showSnackbar('Document uploaded successfully! 🔥', 'success');
      setUploadDialogOpen(false);
      resetUploadForm();
      fetchDocuments(); // Reload documents
    } catch (error) {
      console.error('Error uploading document:', error);
      showSnackbar('Error uploading document', 'error');
    }
  };

  // FURY MODE: Delete document! 🔥
  const handleDeleteDocument = async (documentId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        await AxiosInstance.delete(`/project/${property.id}/legal-documents/${documentId}/`);
        showSnackbar('Document deleted successfully! 💪', 'success');
        fetchDocuments(); // Reload documents
      } catch (error) {
        console.error('Error deleting document:', error);
        showSnackbar('Error deleting document', 'error');
      }
    }
  };

  const resetUploadForm = () => {
    setSelectedFile(null);
    setUploadData({
      document_type: '',
      title: '',
      description: '',
      expiry_date: ''
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDocumentTypeLabel = (type) => {
    const docType = documentTypes.find(dt => dt.value === type);
    return docType ? docType.label : type;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Loading legal documents... 🔥
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
          ⚖️ Legal Documents
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setUploadDialogOpen(true)}
          sx={{ borderRadius: 2 }}
        >
          Upload Document
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Documents List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DocIcon sx={{ color: 'primary.main', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Document Library ({documents.length})
                </Typography>
              </Box>

              {documents.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <LegalIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    No documents uploaded yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Upload your first legal document to get started! 💪
                  </Typography>
                </Box>
              ) : (
                <List>
                  {documents.map((doc) => (
                    <Paper key={doc.id} sx={{ mb: 2, p: 2 }}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemIcon>
                          <DocIcon color="primary" />
                        </ListItemIcon>
                        <Box sx={{ flexGrow: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {doc.title}
                            </Typography>
                            <Chip
                              label={getDocumentTypeLabel(doc.document_type)}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          </Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {doc.description || 'No description provided'}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                            <Typography variant="caption" color="text.secondary">
                              Uploaded: {new Date(doc.upload_date).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              By: {doc.uploaded_by_name}
                            </Typography>
                            {doc.file_size && (
                              <Typography variant="caption" color="text.secondary">
                                Size: {formatFileSize(doc.file_size)}
                              </Typography>
                            )}
                            {doc.expiry_date && (
                              <Chip
                                label={`Expires: ${new Date(doc.expiry_date).toLocaleDateString()}`}
                                size="small"
                                color="warning"
                                variant="outlined"
                              />
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <IconButton
                            color="primary"
                            onClick={() => window.open(doc.file, '_blank')}
                            title="Download/View"
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteDocument(doc.id)}
                            title="Delete"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    </Paper>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Document Types Info */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📋 Document Types
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Supported document types for {property.name}:
              </Typography>
              <Box>
                {documentTypes.map((docType) => (
                  <Typography key={docType.value} variant="body2" sx={{ mb: 0.5 }}>
                    • {docType.label}
                  </Typography>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* FURY MODE: Upload Dialog! 🔥 */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <UploadIcon sx={{ mr: 1, color: 'primary.main' }} />
            Upload Legal Document
          </Box>
          <IconButton onClick={() => setUploadDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Document Type</InputLabel>
              <Select
                value={uploadData.document_type}
                onChange={(e) => setUploadData({ ...uploadData, document_type: e.target.value })}
                label="Document Type"
              >
                {documentTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              required
              label="Document Title"
              value={uploadData.title}
              onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
              placeholder="e.g., Main Lease Agreement - January 2024"
            />

            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description (Optional)"
              value={uploadData.description}
              onChange={(e) => setUploadData({ ...uploadData, description: e.target.value })}
              placeholder="Brief description of the document..."
            />

            <TextField
              fullWidth
              type="date"
              label="Expiry Date (Optional)"
              value={uploadData.expiry_date}
              onChange={(e) => setUploadData({ ...uploadData, expiry_date: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />

            {/* File Upload */}
            <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center' }}>
              {selectedFile ? (
                <Box>
                  <DocIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Size: {formatFileSize(selectedFile.size)}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => setSelectedFile(null)}
                    sx={{ mt: 2 }}
                  >
                    Remove File
                  </Button>
                </Box>
              ) : (
                <Box>
                  <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                    Choose file to upload
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    PDF, DOC, DOCX, PNG, JPG files supported
                  </Typography>
                  <Button variant="contained" component="label">
                    Select File
                    <input
                      type="file"
                      hidden
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      onChange={(e) => setSelectedFile(e.target.files[0])}
                    />
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setUploadDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleFileUpload}
            disabled={!selectedFile || !uploadData.title || !uploadData.document_type}
            startIcon={<UploadIcon />}
          >
            Upload Document 🔥
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LegalDocuments;