const axios = require('axios');

async function testWithRealEmail() {
  try {
    console.log("Testing admin registration with real details...");
    const response = await axios.post('http://localhost:3000/api/admin/register/initiate', {
      name: "Berglin Test",
      email: "berglin.test@example.com"
    });
    console.log("✓ Response:", response.data);
    console.log("\n📧 Check your email at berglin1998@gmail.com for the OTP!");
    console.log("   (Check spam folder if not in inbox)");
  } catch (error) {
    console.error("✗ Error:", error.response ? error.response.data : error.message);
  }
}

testWithRealEmail();
