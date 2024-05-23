"use client";
import React, { useEffect, useState } from "react";
import { fetchAllPogs } from "@/utils/getPogs";
import { getUserProfile } from "@/utils/userDetails";
import { buyPog } from "@/utils/buyPog";
import { sellPog } from "@/utils/sellPog";
import { useRouter } from "next/navigation";

export default function Home() {
  interface PogUpdate {
    id: number;
    color: string;
    tickerSymbol: string;
    percentage: string;
  }

  interface Pog {
    id: number;
    name: string;
    tickerSymbol: string;
    price: number;
    previousPrice: number;
    color: string;
  }

  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [eWallet, setEWallet] = useState("");
  const [showPogs, setShowPogs] = useState<Pog[]>([]);
  const [pogUpdates, setPogUpdates] = useState<PogUpdate[]>([]);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserId = window.localStorage.getItem("userId");
      console.log(storedUserId);
      if (!storedUserId) {
        router.push("/login");
      } else {
        setUserId(storedUserId);
      }
    }
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      if (userId) {
        console.log(`Fetching user profile for user ID: ${userId}`);
        const userProfile = await getUserProfile(Number(userId));
        const getPogs = await fetchAllPogs();

        const pogsWithPercentages = getPogs.map((pog: Pog) => {
          let color = "black";
          let setPercentage = "0.00%";
          const price = pog.price;
          const previousPrice = pog.previousPrice;

          if (previousPrice === 0) {
            // New pog
            setPercentage = "0.00%";
          } else {
            const percentage = ((price - previousPrice) / previousPrice) * 100;

            if (percentage > 0) {
              setPercentage = `+${percentage.toFixed(2)}%`;
              color = "green";
            } else if (percentage < 0) {
              setPercentage = `${percentage.toFixed(2)}%`;
              color = "red";
            }
          }

          return {
            id: pog.id,
            tickerSymbol: pog.tickerSymbol,
            color: color,
            percentage: setPercentage,
          };
        });

        setShowPogs(getPogs);
        setName(userProfile.name);
        setEWallet(userProfile.eWallet);
        setPogUpdates(pogsWithPercentages);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleBuyPogs = async (pogId: number) => {
    try {
      await buyPog(pogId, Number(userId), 1);
      alert("Pog bought successfully.");
    } catch {
      console.error("Error");
    }
  };

  const handleSellPogs = async (pogId: number) => {
    try {
      await sellPog(pogId, Number(userId), 1);
      alert("Pog sold successfully.");
    } catch {
      console.error("Error");
    }
  };

  const handleLogout = async () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <main className="flex min-h-screen flex-col justify-center p-24">
      {/* Ticker Marquee Container */}
      <div className="mt-8">
        {pogUpdates.length === 0 ? (
          <marquee
            className="bg-white border border-gray-300 rounded-l"
            behavior="scroll"
            direction="left"
            scrollamount="5"
          >
            No pogs in database.
          </marquee>
        ) : (
          <marquee
            className="bg-white border border-gray-300 rounded-l"
            behavior="scroll"
            direction="left"
            scrollamount="5"
          >
            {pogUpdates.map((update) => (
              <span
                key={update.id}
                style={{ color: update.color, marginRight: "1rem" }}
              >
                {update.tickerSymbol}: {update.percentage}
              </span>
            ))}
          </marquee>
        )}
      </div>

      <div className="bg-white border border-gray-300 rounded-xl p-8">
        <h2 className="text-2xl text-black font-semibold mb-6">HOME PAGE</h2>
        <p className="text-black">Welcome {name}!</p>
        <p className="text-black">E-Wallet Amount: {eWallet}</p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold mt-1 py-2 px-4 rounded"
          onClick={() => handleLogout()}
        >
          Logout
        </button>
      </div>

      {/* Pogs Card Container */}
      <div className="mt-8">
        <h3 className="text-xl font-medium mb-2 text-white">POGS SHOWCASE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {showPogs.map((pog) => (
            <div
              key={pog.id}
              className="bg-white border border-gray-300 rounded-lg p-4 shadow-md"
            >
              <div
                className="relative h-32 w-32 mb-4"
                style={{ borderRadius: "50%", backgroundColor: pog.color }}
              >
                <div className={`absolute inset-0 bg-${pog.color}-500`} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-bold">{pog.name}</h4>
                <p className="text-sm">${pog.price}</p>
                <button
                  className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => handleBuyPogs(pog.id)}
                >
                  Buy Pog
                </button>
                <button
                  className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600"
                  onClick={() => handleSellPogs(pog.id)}
                >
                  Sell Pog
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
