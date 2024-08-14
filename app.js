const express = require('express');
const leadRouter = require('./route/lead.route'); // Ensure this path is correct
require('dotenv').config();
const Connection=require('./mongodb')
const LeadModel = require('./schema/lead.schema');
const ConvertNumber = require('./helpers/convertnumber');
const axios = require('axios');
 // Make sure to require axios if it's not already

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json()); // Parse JSON bodies

// Mount the leadRouter at /api
app.use('/api', leadRouter);

// Example webhook endpoint
app.post('/webhook', async (req, res) => {
  console.log("Webhook received:", req.body);



  
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error handling middleware:', err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
