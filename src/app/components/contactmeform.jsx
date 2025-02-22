import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import { FaPhoneAlt, FaDownload } from 'react-icons/fa';

export const ContactButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [messageError, setMessageError] = useState('');

  const toggleModal = () => {
    setIsOpen(!isOpen);
    resetErrors();
  };

  const resetErrors = () => {
    setNameError('');
    setEmailError('');
    setMessageError('');
  };

  const validateFields = () => {
    let valid = true;
    resetErrors();

    if (!name) {
      setNameError('Company Name or Your Name is required.');
      valid = false;
    }

    if (!email) {
      setEmailError('Your Email is required.');
      valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter a valid email address.');
        valid = false;
      }
    }

    if (!message) {
      setMessageError('Enter Your Message is required.');
      valid = false;
    }

    return valid;
  };

  const handleSend = async () => {
    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/contactme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.ok) {
        resetFields();
        setSnackbarMessage('Your message has been sent successfully! We will revert back soon.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to send your message. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('An error occurred. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setIsLoading(false);
      setIsOpen(false);
      setSnackbarOpen(true);
    }
  };

  const resetFields = () => {
    setName('');
    setEmail('');
    setMessage('');
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        className="flex items-center rounded-full p-5"
        startIcon={<FaPhoneAlt />}
        onClick={toggleModal}
      >
        Contact Me
      </Button>

      <Dialog open={isOpen} onClose={toggleModal} aria-labelledby="contact-dialog-title">
        <DialogTitle id="contact-dialog-title" sx={{ textAlign: 'center', fontWeight: 'bold' }}>
          Contact Me
        </DialogTitle>
        <DialogContent>
          <form className="space-y-4">
            <TextField
              autoFocus
              margin="dense"
              label="Company Name or Your Name"
              type="text"
              fullWidth
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!nameError}
              helperText={nameError}
            />
            <TextField
              margin="dense"
              label="Your Email"
              type="email"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
            />
            <TextField
              margin="dense"
              label="Enter Your Message"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              error={!!messageError}
              helperText={messageError}
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleModal} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleSend} color="primary" variant="contained" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export const RequestResumeButton = () => {
  const [resumeDialogOpen, setResumeDialogOpen] = useState(false);
  const [resumeEmail, setResumeEmail] = useState('');
  const [resumeEmailError, setResumeEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const toggleResumeDialog = () => {
    setResumeDialogOpen(!resumeDialogOpen);
    setResumeEmail('');
    setResumeEmailError('');
  };

  const handleRequestResume = async () => {
    if (!resumeEmail) {
      setResumeEmailError('Email is required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(resumeEmail)) {
      setResumeEmailError('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/requestresume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: resumeEmail }),
      });

      if (response.ok) {
        setSnackbarMessage('Your resume request has been sent successfully! Check your email soon.');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage('Failed to send your request. Please try again.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbarMessage('An error occurred. Please try again later.');
      setSnackbarSeverity('error');
    } finally {
      setIsLoading(false);
      toggleResumeDialog(); // Close the dialog
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Button
        variant="contained"
        color="secondary"
        className="flex items-center rounded-full p-5"
        startIcon={<FaDownload />}
        onClick={toggleResumeDialog}
      >
        Request Resume
      </Button>

      <Dialog open={resumeDialogOpen} onClose={toggleResumeDialog}>
        <DialogTitle>Request Resume</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Your Email"
            type="email"
            fullWidth
            variant="outlined"
            value={resumeEmail}
            onChange={(e) => setResumeEmail(e.target.value)}
            error={!!resumeEmailError}
            helperText={resumeEmailError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleResumeDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button onClick={handleRequestResume} color="primary" variant="contained" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Request'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

const ContactPopup = () => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-8">
      <ContactButton />
      <RequestResumeButton />
    </div>
  );
};

export default ContactPopup;
