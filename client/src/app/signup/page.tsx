"use client";
import React, { useState } from "react";
import validator from "validator";
import axios from "axios";
import { useRouter } from 'next/navigation';
import { signup } from "@/utils/createUser";

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validator.isEmail(email)) {
      return setErrorMessage('Please enter a valid email address.');
    }

    if (password.length < 10) {
      return setErrorMessage('Password must be at least 10 characters long.');
    }

    if (!firstName.trim() || !lastName.trim() || !position.trim()) {
      return setErrorMessage('All fields are required.');
    }

    setErrorMessage("");

    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('position', position);
      formData.append('email', email);
      formData.append('password', password);

      

      const response = await axios.post('/signup', {
        email,
        firstName,
        lastName,
        position,
        password,
      });      
      console.log('Registration successful');
      router.push('/login'); 
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setErrorMessage(error.response?.data?.message || 'An error occurred during registration.');
    }
  };

  const positions = ['Admin', 'User'];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="border border-gray-300 rounded-xl">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl text-black font-semibold mb-6">Sign Up</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            >
              <option value="">Select a position</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
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
          <button type="submit" className="text-black w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600">Sign Up</button>
        </form>
      </div>
    </main>
  );
}