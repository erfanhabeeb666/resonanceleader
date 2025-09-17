// src/services/leaderboardService.js
const BIN_ID = "68cbd8e7ae596e708ff2cede"; // Replace with your JSONBin ID
const API_KEY = "$2a$10$bFAohK1LnxE70qa1US8Cte754xYmxI9eEITtLtU0.ZMbmAgETy5bi"; // Replace with your JSONBin secret key
const BASE_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`

export async function getLeaderboard() {
  try {
    const response = await fetch(BASE_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY, // remove if bin is public
      },
    });
    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error("❌ Error fetching leaderboard:", error);
    return [];
  }
}

export async function updateLeaderboard(newData) {
  try {
    const response = await fetch(BASE_URL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-Master-Key": API_KEY,
      },
      body: JSON.stringify(newData),
    });

    const data = await response.json();
    return data.record || [];
  } catch (error) {
    console.error("❌ Error updating leaderboard:", error);
    throw error;
  }
}
// ✅ update only one house score
export async function updateHouseScore(houseName, points) {
  const current = await getLeaderboard();
  const updated = current.map((h) =>
    h.house === houseName ? { ...h, points } : h
  );
  return await updateLeaderboard(updated);
}