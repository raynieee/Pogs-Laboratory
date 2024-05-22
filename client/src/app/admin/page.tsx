"use client";
import React, { useEffect, useState } from "react";
import { triggerPriceRandomization } from "@/utils/randomizePrice";
import { addPog } from "@/utils/addPog";
import { deletePog } from "@/utils/deletePog";
import { fetchAllPogs } from "@/utils/getPogs";
import { updatePog } from "@/utils/updatePog";

interface Pog {
  id: number;
  name: string;
  tickerSymbol: string;
  price: number;
  color: string;
}

// separate form to create pogs, the option to delete the pogs, the option to edit the pog, price randomizer button
// ikaw input sng initial price of pog, prev price of initial pog is zero, then for the edit: everything except the price
export default function Admin() {
  const [pogId, setPogId] = useState<number | null>(null);
  const [pogName, setPogName] = useState("");
  const [pogTickerSymbol, setPogTickerSymbol] = useState("");
  const [pogPrice, setPogPrice] = useState("");
  const [pogColor, setPogColor] = useState("");
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [showEditForm, setShowEditForm] = useState(false); // State to control edit form visibility
  const [tableData, setTableData] = useState<Pog[]>([]); // State to hold table data

  const fetchPogs = async () => {
    const response = await fetchAllPogs();
    setTableData(response);
  };

  useEffect(() => {
    fetchPogs();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Create a new object with the form data
    const newData = {
      name: pogName,
      tickerSymbol: pogTickerSymbol,
      price: pogPrice,
      color: pogColor,
    };

    try {
      const response = await addPog(
        newData.name,
        Number(newData.price),
        newData.tickerSymbol,
        newData.color
      );

      console.log("response", response);

      // Update the table data state with the new entry
      // setTableData([...tableData, response.data.pog]);

      // Clear the form after submission
      setPogName("");
      setPogTickerSymbol("");
      setPogPrice("");
      setPogColor("");
      setShowForm(false); // Hide the form after submission
      alert("Added pog successfully.");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = async (e: any) => {
    e.preventDefault();

    // Create a new object with the form data
    const newData = {
      id: pogId,
      name: pogName,
      tickerSymbol: pogTickerSymbol,
      price: pogPrice,
      color: pogColor,
    };

    try {
      const response = await updatePog(
        Number(newData.id),
        newData.name,
        newData.tickerSymbol,
        Number(newData.price),
        newData.color
      );

      console.log("response", response);

      // Update the table data state with the new entry
      // setTableData([...tableData, response.data.pog]);

      // Clear the form after submission
      setPogName("");
      setPogTickerSymbol("");
      setPogPrice("");
      setPogColor("");
      setShowForm(false); // Hide the form after submission
      alert("Edited pog successfully.");
    } catch (error) {
      console.error(error);
    }
  };
  // Function to handle deletion of a row
  const handleDelete = async (id: number) => {
    await deletePog(id);
    setTableData(tableData.filter((_, index) => index !== id));
    alert('Pog deleted successfully.')
  };

  const handleRandomPriceChange = async () => {
    try {
      await triggerPriceRandomization();
      alert(`Pog prices randomized successfully.`);
    } catch {
      console.error("Error");
    }
  };

  return (
    <main className="flex min-h-screen p-24 gap-4">
      <div className="w-1/2">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Pog
        </button>
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4"
          >
            <h2 className="text-2xl text-black font-semibold mb-6">Add pog</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Enter Pog Name"
                value={pogName}
                onChange={(e) => setPogName(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Enter Pog Ticker Symbol"
                value={pogTickerSymbol}
                onChange={(e) => setPogTickerSymbol(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Enter Pog Price"
                value={pogPrice}
                onChange={(e) => setPogPrice(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
              <input
                type="text"
                placeholder="Enter Pog Color"
                value={pogColor}
                onChange={(e) => setPogColor(e.target.value)}
                className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <div className="w-1/2">
        <table className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ticker Symbol</th>
              <th>Price</th>
              <th>Color</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((data, index) => (
              <tr key={index}>
                <td>{data.name}</td>
                <td>{data.tickerSymbol}</td>
                <td>{data.price}</td>
                <td>{data.color}</td>
                <td>
                  <button
                    onClick={() => {
                      setShowEditForm(!showEditForm);
                      setPogId(data.id);
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Edit Pog
                  </button>

                  {showEditForm && (
                    <form
                      onSubmit={handleEdit}
                      className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mt-4"
                    >
                      <h2 className="text-2xl text-black font-semibold mb-6">
                        Edit pog
                      </h2>
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Enter Pog Name"
                          value={pogName}
                          onChange={(e) => setPogName(e.target.value)}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Enter Pog Ticker Symbol"
                          value={pogTickerSymbol}
                          onChange={(e) => setPogTickerSymbol(e.target.value)}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Enter Pog Price"
                          value={pogPrice}
                          onChange={(e) => setPogPrice(e.target.value)}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                        <input
                          type="text"
                          placeholder="Enter Pog Color"
                          value={pogColor}
                          onChange={(e) => setPogColor(e.target.value)}
                          className="text-black w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="text-white w-full py-2 mt-6 bg-blue-500 rounded-md hover:bg-blue-600"
                      >
                        Submit
                      </button>
                    </form>
                  )}
                  <br />
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDelete(data.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleRandomPriceChange()}>
          Randomize Prices
        </button>
      </div>
    </main>
  );
}
