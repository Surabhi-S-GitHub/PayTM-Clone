/* eslint-disable react/no-unescaped-entities */
import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export function SendMoney() {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState("");
  const [status, setStatus] = useState(""); // transferring | success | error
  const navigate = useNavigate();

  const handleTransfer = async () => {
    try {
      setStatus("transferring");

      const response = await axios.post(
        "http://localhost:3000/api/v1/account/transfer",
        {
          to: id,
          amount,
          pin,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      // Simulate transfer delay
      setTimeout(() => {
        setStatus("success");
        setTimeout(() => {
          navigate(
            `/dashboard?amount=${response.data.newAmount}&firstName=${name[0].toUpperCase()}`
          );
        }, 2000);
      }, 4000);

    } catch (error) {
      console.error("🔥 Error during transfer:", error);

      // Show error overlay for 3 seconds
      setTimeout(() => {
        setStatus("error");
        setTimeout(() => {
          setStatus("");
        }, 3000);
      }, 2000); // Optional delay to match UI timing
    }
  };

  return (
    <div className="flex justify-center h-screen bg-gray-100 relative">
      {/* Transferring overlay */}
      {status === "transferring" && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center text-white text-xl font-semibold z-50">
          Transferring amount...
        </div>
      )}

      {/* Success overlay */}
      {status === "success" && (
        <div className="absolute inset-0 bg-green-700 bg-opacity-80 flex flex-col justify-center items-center text-white text-2xl font-bold z-50">
          Amount transaction successful 🎉
        </div>
      )}

      {/* Error overlay */}
      {status === "error" && (
        <div className="absolute inset-0 bg-red-600 bg-opacity-80 flex flex-col justify-center items-center text-white text-xl font-semibold z-50">
          Transfer failed: Incorrect PIN or Insufficient balance
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h3 className="text-lg font-semibold mb-4">Enter 6-digit PIN</h3>
            <input
              type="password"
              maxLength={6}
              pattern="\d{6}"
              className="border p-2 w-full mb-4 text-center text-xl"
              placeholder="******"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded w-full"
              onClick={() => {
                setShowPinModal(false);
                handleTransfer();
              }}
              disabled={pin.length !== 6}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="h-full flex flex-col justify-center">
        <div className="border text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col space-y-1.5 p-6">
            <h2 className="text-center font-bold text-3xl">Send Money</h2>
          </div>

          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">{name[0].toUpperCase()}</span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
          </div>

          <div className="space-y-4 px-6 pb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Amount (in Rs)</label>
              <input
                type="number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                id="amount"
                placeholder="Enter amount"
                onChange={(e) => setAmount(Number(e.target.value))}
              />

              <button
                className="justify-center rounded-md text-sm font-medium ring-offset-background transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
                onClick={() => {
                  if (amount <= 0) {
                    alert("Please enter a valid amount");
                  } else {
                    setShowPinModal(true);
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
