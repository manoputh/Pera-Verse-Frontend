const express = require('express');
const cors = require('cors'); // Import the cors middleware
const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for all routes

// Mock crowd data sets for different times
const crowdDataSets = [
  [
    // 9:00:00 AM
    { buildingId: 1, buildingName: "Faculty Canteen", currentCount: 60, predictedCount: 85, color: "#ff6384", timestamp: "09:00:00" },
    { buildingId: 2, buildingName: "Lecture Hall 1", currentCount: 40, predictedCount: 70, color: "#36a2eb", timestamp: "09:00:00" },
    { buildingId: 3, buildingName: "Drawing Office 1", currentCount: 90, predictedCount: 95, color: "#cc65fe", timestamp: "09:00:00" },
    { buildingId: 4, buildingName: "Library", currentCount: 75, predictedCount: 80, color: "#aaff80", timestamp: "09:00:00" },
    { buildingId: 5, buildingName: "Lab 1", currentCount: 50, predictedCount: 65, color: "#f57c00", timestamp: "09:00:00" },
    { buildingId: 6, buildingName: "Lecture Hall 2", currentCount: 30, predictedCount: 40, color: "#7cb342", timestamp: "09:00:00" },
    { buildingId: 7, buildingName: "Drawing Office 2", currentCount: 85, predictedCount: 90, color: "#323cc3ff", timestamp: "09:00:00" }
  ],
  [
    // 9:00:05 AM
    { buildingId: 1, buildingName: "Faculty Canteen", currentCount: 62, predictedCount: 87, color: "#ff6384", timestamp: "09:00:05" },
    { buildingId: 2, buildingName: "Lecture Hall 1", currentCount: 42, predictedCount: 72, color: "#36a2eb", timestamp: "09:00:05" },
    { buildingId: 3, buildingName: "Drawing Office 1", currentCount: 92, predictedCount: 97, color: "#cc65fe", timestamp: "09:00:05" },
    { buildingId: 4, buildingName: "Library", currentCount: 77, predictedCount: 82, color: "#aaff80", timestamp: "09:00:05" },
    { buildingId: 5, buildingName: "Lab 1", currentCount: 52, predictedCount: 67, color: "#f57c00", timestamp: "09:00:05" },
    { buildingId: 6, buildingName: "Lecture Hall 2", currentCount: 32, predictedCount: 42, color: "#7cb342", timestamp: "09:00:05" },
    { buildingId: 7, buildingName: "Drawing Office 2", currentCount: 87, predictedCount: 92, color: "#323cc3ff", timestamp: "09:00:05" }
  ],
  [
    // 9:00:10 AM
    { buildingId: 1, buildingName: "Faculty Canteen", currentCount: 65, predictedCount: 90, color: "#ff6384", timestamp: "09:00:10" },
    { buildingId: 2, buildingName: "Lecture Hall 1", currentCount: 45, predictedCount: 75, color: "#36a2eb", timestamp: "09:00:10" },
    { buildingId: 3, buildingName: "Drawing Office 1", currentCount: 95, predictedCount: 99, color: "#cc65fe", timestamp: "09:00:10" },
    { buildingId: 4, buildingName: "Library", currentCount: 80, predictedCount: 85, color: "#aaff80", timestamp: "09:00:10" },
    { buildingId: 5, buildingName: "Lab 1", currentCount: 55, predictedCount: 70, color: "#f57c00", timestamp: "09:00:10" },
    { buildingId: 6, buildingName: "Lecture Hall 2", currentCount: 35, predictedCount: 45, color: "#7cb342", timestamp: "09:00:10" },
    { buildingId: 7, buildingName: "Drawing Office 2", currentCount: 90, predictedCount: 95, color: "#323cc3ff", timestamp: "09:00:10" }
  ]
];

// API endpoint
app.get('/api/crowd', (req, res) => {
  // Simulate live data by cycling through datasets every 5 seconds
  const now = new Date();
  const seconds = now.getSeconds();
  const index = Math.floor((seconds % 15) / 5); // 0, 1, or 2
  res.json(crowdDataSets[index]);
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});