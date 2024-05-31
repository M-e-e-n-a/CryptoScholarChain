import React, { useState } from 'react';
import { Button, TextField, CircularProgress, Snackbar } from '@mui/material';
import { web3, donationContract } from '../web3Setup';

const MakeDonation = () => {
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
            const weiAmount = web3.utils.toWei(amount, 'ether');

            // Perform the donation transaction
            await donationContract.methods.donate().send({ from: account, value: weiAmount });

            setSnackbarMessage('Donation successful');
            setSnackbarOpen(true);
        } catch (error) {
            console.error('Donation Error:', error);
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        }
        setLoading(false);
    };

    return (
        <div style={{ padding: 20 }}>
            <form onSubmit={onSubmit}>
                <TextField
                    label="Amount (ETH)"
                    variant="outlined"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    fullWidth
                    required
                    style={{ marginBottom: 20 }}
                />
                <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? <CircularProgress size={24} /> : 'Make Donation'}
                </Button>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={snackbarMessage}
            />
        </div>
    );
};

export default MakeDonation;
