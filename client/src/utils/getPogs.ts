import axios from "axios";

export async function fetchAllPogs() {
  try {
    const response = await axios.get("http://localhost:8080/api/pogs");

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const pogs = response.data.pogs;
    console.log("Successfully fetched pogs:", pogs); 
  } catch (error) {
    console.error("Error fetching pogs:", error);
  }
}
