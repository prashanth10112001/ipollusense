import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import axios from "axios";

const Report = ({ nodeValue }) => {
  const [view, setView] = useState("2hr");
  const [twoHourReports, setTwoHourReports] = useState([]);
  const [dailyReports, setDailyReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const TWO_HOUR_URL = "http://localhost:3500/api/reports";
  const DAILY_URL = "http://localhost:3500/api/reports/dailyReport";

  const fetchReports = useCallback(async () => {
    try {
      const [twoHourRes, dailyRes] = await Promise.all([
        axios.get(`${TWO_HOUR_URL}?nodeValue=${nodeValue}`),
        axios.get(`${DAILY_URL}?nodeValue=${nodeValue}`),
      ]);
      setTwoHourReports(twoHourRes.data.data);
      setDailyReports(dailyRes.data.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [nodeValue]);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
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

  const formatTime = (dateString) => {
    const date = new Date(dateString); // Convert string to Date object
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); // Format time as HH:MM
  };

  const renderTwoHourTable = () => {
    // Group reports by date
    const groupedReports = {};

    twoHourReports.forEach((report) => {
      const date = report.startTime.split(" ")[0]; // Extract YYYY-MM-DD
      if (!groupedReports[date]) {
        groupedReports[date] = [];
      }
      groupedReports[date].push(report);
    });

    return Object.entries(groupedReports).map(([date, dailyReports]) => (
      <Box key={date} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 1,
            fontWeight: "bold",
            color: "#1976d2",
            borderBottom: "2px solid #1976d2",
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
          }}
        >
          Date: {date}
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: "100%", tableLayout: "auto" }}>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                {[
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
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {dailyReports.map((report, i) => (
                <TableRow
                  key={report._id}
                  sx={{ backgroundColor: i % 2 === 0 ? "#f5f5f5" : "white" }}
                >
                  <TableCell>{formatTime(report.startTime)}</TableCell>
                  <TableCell>{formatTime(report.endTime)}</TableCell>
                  <TableCell
                    sx={{
                      color: getAQIColor(report.avgAQI),
                      fontWeight: "bold",
                    }}
                  >
                    {report.avgAQI?.toFixed(2)}
                  </TableCell>
                  <TableCell>{report.avgTemperature?.toFixed(1)}</TableCell>
                  <TableCell>{report.avgHumidity?.toFixed(1)}</TableCell>
                  <TableCell style={{ color: "red" }}>
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
      </Box>
    ));
  };

  const renderDailyTable = () => {
    return dailyReports.map((report) => (
      <Box key={report._id} sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            mb: 1,
            fontWeight: "bold",
            color: "#1976d2",
            borderBottom: "2px solid #1976d2",
            fontSize: { xs: "16px", sm: "18px", md: "20px" },
          }}
        >
          Date: {report.date}
        </Typography>

        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: "100%", tableLayout: "auto" }}>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                {[
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
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: { xs: "12px", sm: "14px", md: "16px" },
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {report.quarters.map((q, i) => (
                <TableRow
                  key={q._id}
                  sx={{ backgroundColor: i % 2 === 0 ? "#f5f5f5" : "white" }}
                >
                  <TableCell>{formatTime(q.startTime)}</TableCell>
                  <TableCell>{formatTime(q.endTime)}</TableCell>
                  <TableCell
                    sx={{ color: getAQIColor(q.avgAQI), fontWeight: "bold" }}
                  >
                    {q.avgAQI.toFixed(2)}
                  </TableCell>
                  <TableCell>{q.avgTemperature.toFixed(1)}</TableCell>
                  <TableCell>{q.avgHumidity.toFixed(1)}</TableCell>
                  <TableCell style={{ color: "red" }}>
                    {q.dominantPollutant}
                  </TableCell>
                  <TableCell>{q.powerConsumption}</TableCell>
                  <TableCell
                    sx={{ color: getAQIColor(q.avgAQI), fontWeight: "bold" }}
                  >
                    {q.summary}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    ));
  };

  return (
    <Box p={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
          alignItems: "center",
          mb: 5,
          gap: 2,
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: "20px", sm: "25px", md: "30px" },
            fontWeight: "bold",
            color: "#1976d2",
            display: "inline-block",
          }}
        >
          Air Quality Reports
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => newView && setView(newView)}
        >
          <ToggleButton
            value="2hr"
            sx={{ fontSize: { xs: "12px", sm: "14px" } }}
          >
            2-Hour Reports
          </ToggleButton>
          <ToggleButton
            value="24hr"
            sx={{ fontSize: { xs: "12px", sm: "14px" } }}
          >
            24-Hour Reports
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : view === "2hr" ? (
        renderTwoHourTable()
      ) : (
        renderDailyTable()
      )}
    </Box>
  );
};

export default Report;
