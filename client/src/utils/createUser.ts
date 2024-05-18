import axios from "axios";

export async function signup(email: string, firstName: string, lastName: string, position: string, password: string) {
  try {
    const response = await axios.post("http://localhost:8080/signup", {
      email,
      firstName,
      lastName,
      position,
      password,
    });

    if (response.status !== 201) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const newUser = response.data;
    console.log("User successfully signed up:", newUser);
  } catch (error) {
    console.error("Error during signup:", error);
  }
}