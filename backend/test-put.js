import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  try {
    const token = jwt.sign({ id: '60d0fe4f5311236168a109ca', role: 'admin' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '1h' });
    const payload = {
      institutionalResources: {
        heading: 'Institutional Resources',
        description: 'Test'
      },
      library: {
        heading: 'Library',
        description: 'Test',
        description2: 'Test',
        mainImage: '/assets/Images/fecilities/library_main.jpg',
        thumbnails: ['/assets/Images/fecilities/facility_1.jpg', '/assets/Images/fecilities/facility_2.jpg', '/assets/Images/fecilities/facility_3.jpg']
      },
      otherResources: {
        heading: 'Other Resources',
        items: [
          {
            title: 'Classrooms',
            image: '/assets/Images/fecilities/classrooms_main.jpg',
            description: '',
            description2: '',
            thumbnails: ['/assets/Images/fecilities/facility_4.jpg', '/assets/Images/fecilities/facility_5.jpg', '/assets/Images/fecilities/facility_6.jpg']
          }
        ]
      }
    };
    
    const res = await axios.put('http://localhost:5000/api/cms/facilities-page', payload, {
      headers: { Authorization: \Bearer \\ }
    });
    console.log('Success:', res.status);
  } catch(e) {
    console.error('Error:', e.response?.status, e.response?.data);
  }
}
run();
