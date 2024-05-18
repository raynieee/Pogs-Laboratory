import axios from "axios";

export async function sellPog(id: number, userId: number, sharesToSell: number) {
  try {
    const response = await axios.post(`http://localhost:8080/sell/${id}`, {
      userId,
      sharesToSell,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("Error selling shares:", error);
  }
}