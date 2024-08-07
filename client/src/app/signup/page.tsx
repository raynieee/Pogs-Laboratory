"use client";
import React, { useState } from "react";
import validator from "validator";
import { signup } from "@/utils/createUser";
import { useRouter } from 'next/navigation';
import Link from "next/link";

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [position, setPosition] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();
  const validateEmail = validator.isEmail(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 10) {
      return setErrorMessage('Password must be at least 10 characters long.');
    }

    if (!validateEmail) {
      return setErrorMessage('Please enter a valid email address.');
    }

    if (!firstName.trim() || !lastName.trim() || !position.trim()) {
      return setErrorMessage('All fields are required.');
    }

    setErrorMessage("");

    try {
      await signup(email, firstName, lastName, position, password);
      router.push('/login');
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
      setErrorMessage('An error occurred during registration.');
    }
  };

  const positions = ['Admin', 'User'];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-black text-2xl font-semibold mb-6">Sign Up</h2>
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
            role="position"
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
        <button type="submit" role="signUpButton" className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600 active:bg-blue-700">
          Sign Up
        </button>
        <Link href="/login" className="text-blue-600 py-4">
          <button className="text-blue-500 py-1 cursor-pointer hover:text-blue-800">Already have an account?</button>
        </Link>
      </form>
    </main>
  );
}