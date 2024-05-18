import axios from "axios";

export async function addPog(name: string, price: number, tickerSymbol: string, color: string) {
  try {
    const response = await axios.post("http://localhost:8080/api/pogs", {
      name,
      tickerSymbol,
      price,
      color,
    });

    if (response.status !== 201) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = response.data;
    console.log(data);
  } catch (error) {
    console.error("Error adding pog:", error);
  }
}
