"use client";
import React, { useState } from "react";
import validator from "validator";
import { login } from "@/utils/userLogin";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const validateEmail = validator.isEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }
    if (password.length < 10) {
      setErrorMessage("Password must be at least 10 characters long.");
      return;
    }

    try {
      const response = await login(email, password); 
      localStorage.setItem("userId", response.id);
      localStorage.setItem("position", response.position);
      console.log("Login successful.");
      setErrorMessage("");
      if (response.position === "User") {
        router.push('/home'); 
      } else if (response.position === "Admin") {
        router.push('/admin');
      } else {
        alert('Error logging in.')
        router.push('/login');
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setErrorMessage("An error occurred during login.");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-black text-2xl font-semibold mb-6">Login</h2>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        <button type="submit" className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700">
          Login
        </button>
        <Link href="/signup" className="text-blue-600 py-4">
          <button className="text-blue-500 py-1 cursor-pointer hover:text-blue-800">Don't have an account yet?</button>
        </Link>
      </form>
    </main>
  );
}
