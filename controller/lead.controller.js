const axios = require('axios');

module.exports.lead_get = async (req, res) => {
  console.log("API call");
  try {
    // Define the API endpoint and parameters
    const endpoint = `${process.env.IMO_URL}/Cliente/App_RetornarPessoas`;
    const params = {
      numeroPagina: 1,
      numeroRegistros: 10,
      codigoUsuario: process.env.USER_CODE,
      textoPesquisa: req.query.phone || req.query.email
    };
    
    // Log the endpoint and params for debugging
    console.log('Endpoint:', endpoint);
    console.log('Params:', params);

    // Make the API call
    const response = await axios.get(endpoint, {
      headers: {
        'Accept': 'application/json',
        'chave': process.env.API_CHAVE,
        'codigoacesso': process.env.ACC_CODE
      },
      params
    });

    // Send the response data
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching status:', error.message);
    if (error.response) {
      console.error('Error details:', error.response.data);
    }
    res.status(error.response?.status || 500).json({ error: 'Internal server error' });
  }
};

module.exports.lead_create=async (req,res)=>{
  try {
      const {name,number,email,purpose}=req.query
          const endpoint = `${process.env.IMO_URL}/Lead/IncluirLead`;
          const params = {
            nome: name,
            telefone: number,
            email:email,
            midia: "ChatPro",
            finalidade:purpose?.toString() || purpose,
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

        return res.send(`Thanks ${name}`); // Ensure you return or end the response here
        
  }catch(err){
    console.error('Error fetching status:', err.message);
    return res.send(`Thank you`);
  }
}
