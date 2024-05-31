import { Buffer } from 'buffer'; // Ensure Buffer is imported
const IPFS = require('ipfs-http-client');

// Read environment variables
const projectId = process.env.REACT_APP_PINATA_API_KEY;
const projectSecret = process.env.REACT_APP_PINATA_API_SECRET;

const auth =
  'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

const ipfs = IPFS.create({
  host: 'api.pinata.cloud',
  port: 443,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

export default ipfs;

