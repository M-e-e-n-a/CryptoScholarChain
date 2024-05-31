import React, { useState, useEffect } from 'react';
import { Button, CircularProgress, Snackbar, TextField, Grid, Paper, Typography } from '@mui/material';
import { web3, registrationContract, scholarshipContract, donationContract } from '../web3Setup';
import pinFileToIPFS from '../utils/ipfsClient';

const RegisterUser = () => {
    const [studentLoading, setStudentLoading] = useState(false);
    const [donorLoading, setDonorLoading] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [file, setFile] = useState(null);
    const [studentAmount, setStudentAmount] = useState('');
    const [donorAmount, setDonorAmount] = useState('');
    const [totalDonations, setTotalDonations] = useState(0);
    const [totalDonationAmount, setTotalDonationAmount] = useState(0);
    const [totalApplications, setTotalApplications] = useState(0);
    const [totalApplicationAmount, setTotalApplicationAmount] = useState(0);

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    const fetchStatistics = async () => {
        try {
            const donations = await donationContract.methods.getTotalDonations().call();
            const donationAmount = await donationContract.methods.getTotalDonationAmount().call();
            const applications = await scholarshipContract.methods.getTotalScholarshipApplications().call();
            const applicationAmount = await scholarshipContract.methods.getTotalScholarshipAmount().call();
            setTotalDonations(donations);
            setTotalDonationAmount(web3.utils.fromWei(donationAmount, 'ether'));
            setTotalApplications(applications);
            setTotalApplicationAmount(web3.utils.fromWei(applicationAmount, 'ether'));
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setSnackbarMessage(`Error fetching statistics: ${error.message}`);
            setSnackbarOpen(true);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onRegisterAndApply = async (event) => {
        event.preventDefault();
        if (!file) {
            setSnackbarMessage('Please upload a file.');
            setSnackbarOpen(true);
            return;
        }
        if (!studentAmount) {
            setSnackbarMessage('Please enter the amount.');
            setSnackbarOpen(true);
            return;
        }

        try {
            setStudentLoading(true);
            const result = await pinFileToIPFS(file);
            const ipfsHash = result.IpfsHash;

            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found. Ensure MetaMask is connected and unlocked.');
            }
            const account = accounts[0];

            console.log('Registering student with account:', account);
            console.log('IPFS Hash:', ipfsHash);

            await registrationContract.methods.registerUser('Student', ipfsHash).send({ from: account });

            console.log('Student registered successfully');

            await scholarshipContract.methods.applyForScholarship(web3.utils.toWei(studentAmount, 'ether'), ipfsHash).send({ from: account });

            console.log('Scholarship application submitted successfully');

            setSnackbarMessage('Student registration and scholarship application successful');
            fetchStatistics();
        } catch (error) {
            console.error('Registration and Application Error:', error);
            setSnackbarMessage(`Registration and Application Error: ${error.message}`);
        } finally {
            setStudentLoading(false);
            setSnackbarOpen(true);
        }
    };

    const onSubmitDonor = async (event) => {
        event.preventDefault();
        if (!donorAmount) {
            setSnackbarMessage('Please enter the amount.');
            setSnackbarOpen(true);
            return;
        }

        try {
            setDonorLoading(true);
            const accounts = await web3.eth.getAccounts();
            if (accounts.length === 0) {
                throw new Error('No accounts found. Ensure MetaMask is connected and unlocked.');
            }
            const account = accounts[0];

            await donationContract.methods.donate().send({ from: account, value: web3.utils.toWei(donorAmount, 'ether') });
            setSnackbarMessage('Donation successful');
            fetchStatistics();
        } catch (error) {
            console.error('Donation Error:', error);
            setSnackbarMessage(`Donation Error: ${error.message}`);
        } finally {
            setDonorLoading(false);
            setSnackbarOpen(true);
        }
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={6}>
                <Paper style={{ padding: 20 }}>
                    <Typography variant="h5">Student Registration and Scholarship Application</Typography>
                    <form onSubmit={onRegisterAndApply}>
                        <TextField
                            label="Amount Requested (ETH)"
                            variant="outlined"
                            value={studentAmount}
                            onChange={(e) => setStudentAmount(e.target.value)}
                            fullWidth
                            required
                            style={{ marginBottom: 20 }}
                        />
                        <TextField
                            type="file"
                            onChange={onFileChange}
                            fullWidth
                            required
                        />
                        <Button type="submit" color="primary" variant="contained" disabled={studentLoading} style={{ marginTop: 20 }}>
                            {studentLoading ? <CircularProgress size={24} /> : 'Register and Apply'}
                        </Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={6}>
                <Paper style={{ padding: 20 }}>
                    <Typography variant="h5">Donor Registration</Typography>
                    <form onSubmit={onSubmitDonor}>
                        <TextField
                            label="Donation Amount (ETH)"
                            variant="outlined"
                            value={donorAmount}
                            onChange={(e) => setDonorAmount(e.target.value)}
                            fullWidth
                            required
                            style={{ marginBottom: 20 }}
                        />
                        <Button type="submit" color="primary" variant="contained" disabled={donorLoading} style={{ marginTop: 20 }}>
                            {donorLoading ? <CircularProgress size={24} /> : 'Register and Donate'}
                        </Button>
                    </form>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper style={{ padding: 20 }}>
                    <Typography variant="h6">Statistics</Typography>
                    <Typography>Total Donations: {totalDonations}</Typography>
                    <Typography>Total Donation Amount: {totalDonationAmount} ETH</Typography>
                    <Typography>Total Applications: {totalApplications}</Typography>
                    <Typography>Total Application Amount: {totalApplicationAmount} ETH</Typography>
                </Paper>
            </Grid>
            <Snackbar
                open={snackbarOpen}
                message={snackbarMessage}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            />
        </Grid>
    );
};

export default RegisterUser;
