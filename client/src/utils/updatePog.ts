import axios from "axios";

export async function updatePog(id: number, name: string, tickerSymbol: string, price: number, color: string) {
  try {
    const response = await axios.patch(`http://localhost:8080/api/pogs/${id}`, {
      name,
      tickerSymbol,
      price,
      color,
    });

    if (response.status === 200) {
      console.log(response.data.message);
      return response.data.pog;
    } else {
      throw new Error(`HTTP error Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error updating pog:", error);
  }
}