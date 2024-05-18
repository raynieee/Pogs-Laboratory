import axios from "axios";

export async function fetchPogById(id: number) {
  try {
    const response = await axios.get(`http://localhost:8080/api/pogs/${id}`);

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const pog = response.data.pog;
    console.log("Pog successfully fetched:", pog);
  } catch (error) {
    console.error("Error fetching pog:", error);
  }
}
