const axios = require('axios');
const testApi = async () => {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/users/login', {
      email: 'admin@ksbm.ac.in',
      password: 'adminpassword123'
    });
    const token = loginRes.data.accessToken;
    
    const id = '6a66f496884d2d369e5daf3f';
    const putRes = await axios.put(`http://localhost:5000/api/grievances/${id}`, {
      status: 'Resolved'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Update Success:', putRes.data.status);
    
    const getRes = await axios.get(`http://localhost:5000/api/grievances`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updated = getRes.data.find(g => g._id === id);
    console.log('Refetched Status:', updated.status);
    
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
};
testApi();
