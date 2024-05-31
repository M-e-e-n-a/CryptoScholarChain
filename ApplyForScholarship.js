import React, { useState } from 'react';
import { TextField, Button, Snackbar, CircularProgress } from '@mui/material';
import { web3, scholarshipContract } from '../web3Setup';

const ApplyForScholarship = () => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found. Ensure MetaMask is connected and unlocked.');
            }
            const account = accounts[0];
            await scholarshipContract.methods.applyForScholarship(web3.utils.toWei(amount, 'ether'), "scholarship-ipfs-hash").send({ from: account });
            setSnackbarMessage('Application successful');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Application Error:', error);
            setSnackbarMessage(`Application Error: ${error.message}`);
            setSnackbarOpen(true);
        }
        setLoading(false);
    };

    return (
        <form onSubmit={onSubmit}>
            <TextField
                label="Amount Requested (ETH)"
                variant="outlined"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                required
            />
            <Button type="submit" color="primary" variant="contained" disabled={loading} style={{ marginTop: 20 }}>
                {loading ? <CircularProgress size={24} /> : 'Apply'}
            </Button>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </form>
    );
};

export default ApplyForScholarship;
