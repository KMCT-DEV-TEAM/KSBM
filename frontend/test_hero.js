const axios = require('axios');

async function test() {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/users/login', { email: 'admin@kmct.edu.in', password: 'password123' });
    const token = loginRes.data.accessToken;
    
    console.log('Got token');
    
    // 1. Get current settings
    const res1 = await axios.get('http://localhost:5000/api/cms/hero');
    console.log('Initial showSection:', res1.data.showSection);
    
    // 2. Put with showSection: false
    const putRes = await axios.put('http://localhost:5000/api/cms/hero', { 
        ...res1.data, 
        showSection: false 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('PUT response showSection:', putRes.data.showSection);

    // 3. Get again to verify it was saved in DB
    const res2 = await axios.get('http://localhost:5000/api/cms/hero');
    console.log('After PUT, GET showSection:', res2.data.showSection);
    
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}
test();
