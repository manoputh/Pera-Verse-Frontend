import React, { useState, useEffect, useRef } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import HeatMap from "../components/HeatMap"; // existing HeatMap component
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { LoadingView, ErrorView } from "../utils/uiHelpers"; // your helpers

const CrowdManagement = () => {
  const [crowdData, setCrowdData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("current"); // "current" | "predicted"
  const [selectedBuilding, setSelectedBuilding] = useState("all");
  const [threshold, setThreshold] = useState(80); // adjustable warning threshold

  // TODO: Replace with real API endpoint from other team
  const API_URL = "http://localhost:5000/api/crowd";
  const intervalRef = useRef();

  // Fetch data once and then every 5 seconds
  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 5000);
    return () => clearInterval(intervalRef.current);
  }, []);

  const fetchData = async () => {
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setCrowdData(data);
      setLoading(false);
    } catch (err) {
      setError("Error loading crowd data");
      setLoading(false);
    }
  };

  // Filter data by building
  const filteredData =
    selectedBuilding === "all"
      ? crowdData
      : crowdData.filter((d) => String(d.buildingId) === String(selectedBuilding));

  // Detect alerts based on predicted counts
  const highRiskBuildings = filteredData.filter(
    (d) => d.predictedCount > threshold
  );

  if (loading) return <LoadingView message="Loading crowd data..." />;
  if (error) return <ErrorView message={error} onRetry={fetchData} />;

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Crowd Management</h1>
        <button
          onClick={fetchData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4 mr-2" /> Refresh
        </button>
      </div>

      {/* Live Timestamp */}
      <div className="text-sm text-gray-500">
        Live Data Time: {crowdData[0]?.timestamp || "--:--"}
      </div>

      {/* Alerts */}
      {highRiskBuildings.length > 0 && (
        <div className="p-4 bg-red-100 border border-red-400 rounded-xl flex items-center space-x-3">
          <AlertTriangle className="text-red-600 w-6 h-6" />
          <span className="text-red-800">
            Warning: {highRiskBuildings.length} building(s) predicted to exceed{" "}
            {threshold}% capacity!
          </span>
        </div>
      )}

      {/* Controls */}
      <div className="flex space-x-4 items-center">
        <label>
          View Mode:{" "}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white text-gray-700 transition-all duration-150"
          >
            <option value="current">Current</option>
            <option value="predicted">Predicted</option>
          </select>
        </label>

        <label>
          Building:{" "}
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm bg-white text-gray-700 transition-all duration-150"
          >
            <option value="all">All</option>
            {crowdData.map((d) => (
              <option key={d.buildingId} value={d.buildingId}>
                {d.buildingName}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Heat Map */}
      <HeatMap
        data={filteredData.map((d) => ({
          buildingId: d.buildingId,
          color: d.color,
          count: viewMode === "current" ? d.currentCount : d.predictedCount,
        }))}
      />

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Crowd Trend</h2>
          <ResponsiveContainer width="50%" height={250}>
            <LineChart data={filteredData}>
              <XAxis dataKey="timestamp" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="currentCount" stroke="#8884d8" />
              <Line type="monotone" dataKey="predictedCount" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Current vs Predicted</h2>
          <ResponsiveContainer width="50%" height={250}>
            <BarChart data={filteredData}>
              <XAxis dataKey="buildingId" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="currentCount" fill="#8884d8" />
              <Bar dataKey="predictedCount" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default CrowdManagement;
