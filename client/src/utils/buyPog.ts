import axios from "axios";

export async function buyPog(id: number, userId: number, sharesToBuy: number) {
  try {
    const response = await axios.post(`http://localhost:8080/buy/${id}`, {
      userId,
      sharesToBuy,
    });

    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("Error purchasing shares:", error);
  }
}
