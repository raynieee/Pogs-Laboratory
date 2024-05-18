import axios from "axios";

export async function deletePog(id: number) {
  try {
    const response = await axios.delete(`http://localhost:8080/api/pogs/${id})`);

    if (response.status !== 204) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    console.log("Pog successfully deleted.");
  } catch (error) {
    console.error("Error deleting pog:", error);
  }
}
