import React, { useEffect, useState } from "react";
import { getLeaderboard, updateLeaderboard } from "./Leaderboardservice"

const AdminPanel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [message, setMessage] = useState("");

  const ADMIN_PASSWORD = "college123"; // change to your desired password

  useEffect(() => {
    if (authenticated) {
      const loadData = async () => {
        const scores = await getLeaderboard();
        setData(scores);
        setLoading(false);
      };
      loadData();
    }
  }, [authenticated]);

  const handleChange = (houseName, value) => {
    setData((prev) =>
      prev.map((item) =>
        item.house === houseName ? { ...item, points: Number(value) } : item
      )
    );
  };

  const handleSave = async () => {
    try {
      await updateLeaderboard(data);
      alert("✅ Scores updated successfully!");
    } catch (error) {
      alert("❌ Failed to update scores!");
    }
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      setPassword("");
      setMessage("");
    } else {
      setMessage("❌ Wrong password!");
    }
  };

  // 🔒 Show login if not authenticated
  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-4">Admin Login</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          {message && <p className="text-red-500 mt-2">{message}</p>}
        </div>
      </div>
    );
  }

  // ✅ Show AdminPanel content only if authenticated
  if (loading) {
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h1>
      <div className="w-full max-w-2xl space-y-4">
        {data.map((row) => (
          <div
            key={row.house}
            className="flex justify-between bg-white p-4 shadow rounded"
          >
            <span>{row.house}</span>
            <input
              type="number"
              value={row.points}
              onChange={(e) => handleChange(row.house, e.target.value)}
              className="border px-2 py-1 w-24 rounded"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        className="mt-6 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
      >
        Save
      </button>
    </div>
  );
};

export default AdminPanel;
