/* eslint-disable react/no-unescaped-entities */

import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="flex justify-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-center font-bold text-3xl">Send Money</h2>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name[0].toUpperCase()}
                </span>
              </div>

              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">
                Amount (in Rs)
              </label>

              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                id="amount"
                placeholder="Enter amount"
                onChange={(e) => {
                  setAmount(Number(e.target.value)); // ✅ Ensure it's a number
                }}
              />

              <button
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                onClick={async () => {
                  try {
                    const response = await axios.post(
                      "http://localhost:3000/api/v1/account/transfer",
                      {
                        to: id,
                        amount: amount,
                      },
                      {
                        headers: {
                          Authorization:
                            "Bearer " + localStorage.getItem("token"),
                        },
                      }
                    );

                    // ✅ Navigate to dashboard with new amount and name
                    navigate(
                      `/dashboard?amount=${response.data.newAmount}&firstName=${response.data.userName[0].toUpperCase()}`
                    );
                  } catch (error) {
                    console.log(error);
                    alert("Transfer failed: " + error.response?.data?.msg || "Something went wrong");
                  }
                }}
              >
                Initiate Transfer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
