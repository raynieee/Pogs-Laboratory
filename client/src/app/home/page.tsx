"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [eWallet, setEWallet] = useState('');
  const [errorMessage, setErrorMessage] = useState("");
  const [showPogs, setShowPogs] = useState([]);
  

  // makita ang tanan nga pogs for sale, ticker marquee, prices of pogs displayed as well as prev price, user wallet displayed, all pogs owned by the user

  const showAllPogs = async () => {
    try {
      const response = await axios.get('/api/pogs', { method: 'GET' });
      setShowPogs(response.data); // Correctly update the state with setShowPogs
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to load Pogs");
    }
  };
  
  const userDetails = async () => {
    try {
      const response = await axios.get('/profile', { method: 'GET' });
      setShowPogs(response.data); // Correctly update the state with setShowPogs
    } catch (error) {
      console.error(error); // Directly log the error for clarity
      setErrorMessage("Failed to load user details");
    }
  };
  
  useEffect(() => {
    showAllPogs()
  }, [])

  const tickerText = "Ticker Marquee Text Contents Here"; // Replace with actual ticker text logic
  const pogItems = [
    { tickerSymbol: "PGWPAB", name: "Winnie the Pooh", price: 5.25, color: "#fff19c" },
    { tickerSymbol: "PGPIAC", name: "Piglet", price: 5.25, color: "Pink" },
    // Add more pog items as needed , dont forget ot show the ticker symbol
    //ticker marquee contents: ticker symbol, percentage increase/decrease of price of pog from previous price
  ];

  return (
    <main className="flex min-h-screen flex-col justify-center p-24">
      <div className="bg-white border border-gray-300 rounded-xl p-8">
        <h2 className="text-2xl text-black font-semibold mb-6">Home Page</h2>
        <p className="text-black">Welcome {firstName} {lastName}!</p>
        <p className="text-black">E-Wallet Amount: {eWallet}</p>
      </div>

      {/* Ticker Marquee Container */}
      <div className="mt-8">
        <marquee className="bg-white border border-gray-300 rounded-l" behavior="scroll" direction="left" scrollamount="5">
          {tickerText}
        </marquee>
      </div>

      {/* Pogs Card Container */}
      {/* Pogs Card Container */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-2">Pogs Showcase</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {showPogs.map(pog => (
            <div key={pog.tickerSymbol} className="bg-white border border-gray-300 rounded-lg p-4 shadow-md">
              <div className="relative h-32 w-32 mb-4" style={{ borderRadius: '50%', backgroundColor: pog.color }}>
                <div className={`absolute inset-0 bg-${pog.color}-500`} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">{pog.name}</h4>
                <p className="text-sm">${pog.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
