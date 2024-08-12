const chatProApiUrl = `https://v5.chatpro.com.br/${process.env.API_INSTANCE}/api/v1`;

const sendMessage = async (recipient, message) => {
  try {
    const onlyNumbers = recipient.replace(/\D/g, '');
    const response = await axios.post(`${chatProApiUrl}/send_message`, {
      onlyNumbers,
      message: { text: message }
    }, {
      headers: {
        'Authorization': process.env.API_TOKEN,
        'Content-Type': 'application/json'
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error sending message:', error.message);
    res.status(error.response?.status || 500).json({ error: error.message });
  }
};
module.exports=sendMessage
