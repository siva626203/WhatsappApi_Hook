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

  const number = req.body.message_data.number.split('@')[0];
  console.log("Extracted number:", number);

  try {
    if (req.body.event === 'received_message') {
      Connection()
      // const convertedNumber = ConvertNumber(number);
      // console.log("Converted number:", convertedNumber);

      let lead = await LeadModel.findOne({ phone: number });
      console.log("Lead found:", lead);

      if (!lead || lead.imoview===false) {
        console.log("Lead not found, creating a new lead...");

        let newLead
        if(!lead){
          newLead=await LeadModel.create({ phone: number });
        console.log("New lead created:", newLead);
        }else{
          newLead=lead
        }
        

        try {
          // Define the API endpoint and parameters
          const options = {
            method: 'POST',
            url: 'https://sparks.chatpro.com.br/leads/findByPhoneNumber',
            headers: {
              accept: 'application/json',
              'instance-token': process.env.CHATPRO_APP_TOKEN,
              'content-type': 'application/json'
            },
            data: { phoneNumber: number, instanceId: process.env.CHATPRO_APP }
          };

          const leadResponse = await axios.request(options);
          console.log("Lead response data:", leadResponse.data);

          const endpoint = `${process.env.IMO_URL}/Lead/IncluirLead`;
          const params = {
            nome: leadResponse.data.name,
            telefone: number,
            midia: leadResponse.data.eul,
          };

          // Log the endpoint and params for debugging
          console.log('Endpoint:', endpoint);
          console.log('Params:', params);

          // Make the API call
          const response = await axios.post(endpoint, params, {
            headers: {
              'Accept': 'application/json',
              'chave': process.env.API_CHAVE,
              'codigoacesso': process.env.ACC_CODE
            }
          });

          console.log("API call response:", response.data);

          // Update the newly created lead
          await LeadModel.updateOne({ phone: number }, {
            imoview: true,
            name: leadResponse.data.name
          });
          console.log("Lead updated with Imoview data.");

          // Send the response data
          return res.json(response.data); // Ensure you return or end the response here
        } catch (error) {
          console.error('Error making API calls:', error.message);
          if (error.response) {
            console.error('Error details:', error.response.data);
          }
          return res.status(error.response?.status || 500).json({ error: 'Internal server error' });
        }
      } else {
        console.log("Lead already exists.");
        return res.status(200).json({ message: 'Lead data processed successfully' });
      }
    } else {
      console.log("Unhandled event type:", req.body.event);
      return res.status(400).json({ error: 'Unhandled event type' });
    }
  } catch (error) {
    console.error('Error processing webhook:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
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
