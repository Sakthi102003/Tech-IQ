// Simple test to verify backend API
const testData = {
  projectName: "Test Project",
  projectType: "Full Stack (Both Frontend & Backend)",
  description: "A test project to verify API functionality",
  budget: "Under ₹1,00,000",
  timeline: "3-6 months",
  teamSize: "Solo (1 person)",
  experience: "Intermediate",
  features: ["User Authentication", "Real-time Updates"],
  currency: "INR"
};

async function testAPI() {
  try {
    console.log('Testing backend API...');
    
    const response = await fetch('https://tech-iq-backend.onrender.com/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      return;
    }

    const result = await response.json();
    console.log('API Success:', result);
    
  } catch (error) {
    console.error('Network Error:', error);
  }
}

testAPI();