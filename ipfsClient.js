import axios from 'axios';

const pinFileToIPFS = async (file) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    let data = new FormData();
    data.append('file', file);

    const res = await axios.post(url, data, {
        maxContentLength: 'Infinity',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
            'pinata_api_key': '44bf3dbfc10734c7003a',
            'pinata_secret_api_key': '4719133302108a6cf608ede5c08dfdcdaa3c4478b7b8360e2244bdb1b0a5259c'
        }
    });

    return res.data;
};

export default pinFileToIPFS;
