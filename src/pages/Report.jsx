import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import axios from "axios";

const Report = ({ nodeValue }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const REPORT_URL = "http://localhost:3500/api/reports/";

  const fetchReports = useCallback(async () => {
    try {
      const response = await axios.get(`${REPORT_URL}?nodeValue=${nodeValue}`);
      setReports(response.data.data);
      response.data.data
        ? console.log("reports", response.data.data.length)
        : console.log("no reports");
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [nodeValue]);

  useEffect(() => {
    fetchReports();

    const interval = setInterval(() => {
      console.log("Checking for new reports...");
      fetchReports();
    }, 5 * 60 * 1000);
    // }, 3 * 1000); // Check every 3 seconds

    return () => clearInterval(interval);
  }, [fetchReports]);

  const getAQIColor = (aqi) => {
    if (aqi <= 1) return "#00E400";
    if (aqi <= 2) return "#FFFF00";
    if (aqi <= 3) return "#FF7E00";
    if (aqi <= 4) return "#FF0000";
    if (aqi <= 5) return "#8F3F97";
    if (aqi <= 6) return "#7E0023";
    return "darkred";
  };

  return (
    <Box p={4}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#1976d2" }}
      >
        AQI Reports (Every 2 Hours)
      </Typography>
      {loading ? (
        <Typography variant="h6" color="textSecondary" mt={3}>
          Loading reports...
        </Typography>
      ) : reports.length === 0 ? (
        <Typography variant="h6" color="textSecondary" mt={3}>
          No data available.
        </Typography>
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 1200 }}>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                {[
                  "Device ID",
                  "Start Time",
                  "End Time",
                  "Avg AQI",
                  "Temperature (°C)",
                  "Humidity (%)",
                  "Dominant Pollutant",
                  "Power Consumption (kWh)",
                  "Summary",
                ].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "white", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report, index) => (
                <TableRow
                  key={report._id}
                  sx={{
                    backgroundColor: index % 2 === 0 ? "#f5f5f5" : "white",
                  }}
                >
                  <TableCell>{report.nodeValue}</TableCell>
                  {/* <TableCell>{new Date(report.startTime)}</TableCell>
                  <TableCell>{new Date(report.endTime)}</TableCell> */}
                  <TableCell>
                    {report.startTime instanceof Date
                      ? report.startTime
                          .toISOString()
                          .replace("T", " ")
                          .substring(0, 19)
                      : new Date(report.startTime)
                          .toISOString()
                          .replace("T", " ")
                          .substring(0, 19)}
                  </TableCell>
                  <TableCell>
                    {report.endTime instanceof Date
                      ? report.endTime
                          .toISOString()
                          .replace("T", " ")
                          .substring(0, 19)
                      : new Date(report.endTime)
                          .toISOString()
                          .replace("T", " ")
                          .substring(0, 19)}
                  </TableCell>

                  <TableCell
                    sx={{
                      color: getAQIColor(report.avgAQI),
                      fontWeight: "bold",
                    }}
                  >
                    {report.avgAQI.toFixed(2)}
                  </TableCell>
                  <TableCell>{report.avgTemperature.toFixed(1)}</TableCell>
                  <TableCell>{report.avgHumidity.toFixed(1)}</TableCell>
                  <TableCell sx={{ color: "red" }}>
                    {report.dominantPollutant}
                  </TableCell>
                  <TableCell>{report.powerConsumption} kWh</TableCell>
                  <TableCell
                    sx={{
                      color: getAQIColor(report.avgAQI),
                      fontWeight: "bold",
                    }}
                  >
                    {report.summary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Report;
