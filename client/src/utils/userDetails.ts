import axios from "axios";

export async function getUserProfile(userId: number) {
  try {
    const response = await axios.get(`http://localhost:8080/profile/${userId}`);

    if (response.status === 200) {
      const userDetails = response.data;
      console.log("User details:", userDetails);
      return userDetails;
    } else {
      throw new Error(`HTTP error Status: ${response.status}`);
    }
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}