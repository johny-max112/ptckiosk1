// Test admin login - Run this in browser console after going to localhost:3000/admin

async function testAdminLogin() {
  try {
    console.log('Testing admin login...');
    
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@ptc.edu',
        password: 'admin123'
      })
    });
    
    const data = await response.json();
    console.log('Login response:', data);
    
    if (data.token) {
      console.log('✅ Login successful! Token:', data.token);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminName', data.admin.name);
      
      // Test authenticated request
      const testResponse = await fetch('http://localhost:5000/api/admin/announcements', {
        headers: {
          'Authorization': `Bearer ${data.token}`
        }
      });
      
      console.log('Test API response status:', testResponse.status);
      if (testResponse.ok) {
        console.log('✅ Authentication working!');
      } else {
        console.log('❌ Authentication failed');
      }
    } else {
      console.log('❌ Login failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testAdminLogin();