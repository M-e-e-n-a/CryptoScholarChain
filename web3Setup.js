import Web3 from 'web3';
import Registration from './contracts/Registration.json';
import Donation from './contracts/Donation.json';
import Scholarship from './contracts/Scholarship.json';

// Set up web3 instance
const web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');

const registrationAddress = '0x174Bfe6Bafda249F799E7a2f143baFC2620dC5bC';
const donationAddress = '0x1B5Fbd7D2dAc3b910b414c06a0851781131886b1';
const scholarshipAddress = '0xed6C4ceb4B41b9De4010634668880f40801982C7';

const registrationContract = new web3.eth.Contract(Registration.abi, registrationAddress);
const donationContract = new web3.eth.Contract(Donation.abi, donationAddress);
const scholarshipContract = new web3.eth.Contract(Scholarship.abi, scholarshipAddress);

export { web3, registrationContract, donationContract, scholarshipContract };
