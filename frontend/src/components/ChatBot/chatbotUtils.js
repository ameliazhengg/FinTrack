import axios from 'axios';

export async function generateResponse(userQuestion, transactions) {
  try {
    console.log('Sending request with:', { question: userQuestion, transactions });
    const response = await axios.post('http://localhost:5005/chat', {
      question: userQuestion,
      transactions: transactions
    });

    console.log('Response from server:', response.data);
    return response.data.response;
  } catch (error) {
    console.error('Detailed error:', error.response?.data || error.message);
    return `Error: ${error.response?.data?.error || error.message}`;
  }
}