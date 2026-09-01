import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`broccoli FreshMart Grocery Platform Server is running!`);
  console.log(`🚀 Access Application: http://localhost:${PORT}`);
  console.log(`📡 Health Check API:   http://localhost:${PORT}/api/health`);
  console.log(`====================================================`);
});
