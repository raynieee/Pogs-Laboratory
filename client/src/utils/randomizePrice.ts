import axios from "axios";

export async function triggerPriceRandomization() {
  try {
    const response = await axios.post('http://localhost:8080/randomize-price');

    if (response.status === 200) {
      console.log(response.data.message); 
    } else {
      throw new Error(`HTTP error Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error triggering price randomization:", error);
  }
}