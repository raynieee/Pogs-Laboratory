import axios from 'axios';

export async function login(email: string, password: string) {
  try {
    const response = await axios.post('http://localhost:8080/login', {
      email,
      password,
    });

    if (response.status === 200) {
      console.log(response.data.message);
      return response.data.token;
    } else {
      throw new Error(`HTTP error Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error logging in:", error);
  }
}