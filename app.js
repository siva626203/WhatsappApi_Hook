const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// ChatPro instance details
const instanceId = "chatpro-5ee5b0da2b";
const chatProApiUrl = `https://v5.chatpro.com.br/${instanceId}/api/v1`;
const chatProApiToken = '33edfc5e-1287-4cd1-9a69-36198fc77818'; // Replace with your actual API token

// Function to send a message using ChatPro API
async function sendMessage(to, message) {
  try {
    const response = await axios.post(`${chatProApiUrl}/send_message`, {
      recipient: to,
      message: {
        text: message
      }
    }, {
      headers: {
        'Authorization': chatProApiToken,
        'Content-Type': 'application/json'
      }
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Endpoint to receive webhook events from Chat Pro
app.post('/webhook', (req, res) => {
  const event = req.body;

  console.log('Received event from Chat Pro:', event);

  // Check if the event is an ack_update event
  if (event[0] === 'Msg' && event[1].cmd === 'ack') {
    const { id, ack, from, to, t } = event[1];

    console.log(`ACK update for message ${id}:`, ack);
    
    // Handle ACK update as needed (e.g., update message status in database)
    // Example: Logging the ACK status
    switch (ack) {
      case 0:
        console.log('Message not yet sent');
        break;
      case 1:
        console.log('Message sent');
        break;
      case 2:
        console.log('Message received');
        sendMessage(to, `Message with ID ${id} received.`);
        break;
      case 3:
        console.log('Message read');
        break;
      case 4:
        console.log('Audio played');
        break;
      default:
        console.log('Unknown ACK status');
    }

    res.status(200).send('ACK update received.');
  } else {
    res.status(400).send('Unsupported event type.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
