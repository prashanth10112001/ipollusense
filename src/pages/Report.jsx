import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Pagination,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";

const Report = ({ nodeValue }) => {
  const [view, setView] = useState("2hr");

  // Two-hour reports
  const [twoHourReports, setTwoHourReports] = useState([]);
  const [twoHourTotalPages, setTwoHourTotalPages] = useState(1);
  const [twoHourPage, setTwoHourPage] = useState(1);

  // Daily reports
  const [dailyReports, setDailyReports] = useState([]);
  const [dailyTotalPages, setDailyTotalPages] = useState(1);
  const [dailyPage, setDailyPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const rowsPerPage = 3;

  const TWO_HOUR_URL = "http://localhost:3500/api/reports";
  const DAILY_URL = "http://localhost:3500/api/reports/dailyReport";

  const fetchReports = useCallback(async () => {
    try {
      const [twoHourRes, dailyRes] = await Promise.all([
        axios.get(TWO_HOUR_URL, {
          params: {
            nodeValue,
            page: twoHourPage,
            limit: rowsPerPage,
          },
        }),

        axios.get(DAILY_URL, {
          params: {
            nodeValue,
            page: dailyPage,
            limit: rowsPerPage,
          },
        }),
      ]);

      setTwoHourReports(twoHourRes.data.data);
      setTwoHourTotalPages(twoHourRes.data.totalPages || 1);

      setDailyReports(dailyRes.data.data);
      setDailyTotalPages(dailyRes.data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  }, [nodeValue, twoHourPage, dailyPage, rowsPerPage]);

  useEffect(() => {
    fetchReports();
    const interval = setInterval(fetchReports, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchReports]);

  const getAQIColor = (aqi) => {
    if (aqi <= 1) return "#00E400";
    if (aqi > 1 && aqi <= 2) return "#FFFF00";
    if (aqi > 2 && aqi <= 3) return "#FF7E00";
    if (aqi > 3 && aqi <= 4) return "#FF0000";
    if (aqi > 4 && aqi <= 5) return "#8F3F97";
    if (aqi > 5 && aqi <= 6) return "#7E0023";
    return "darkred";
  };

  const AQI_LEVELS = {
    1: { label: "Good", color: "#00E400" },
    2: { label: "Moderate", color: "#FFFF00" },
    3: { label: "Satisfactory", color: "#FF7E00" },
    4: { label: "Poor", color: "#FF0000" },
    5: { label: "Very Poor", color: "#8F3F97" },
    6: { label: "Severe", color: "#7E0023" },
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderTwoHourTable = () => {
    const groupedReports = {};
    twoHourReports.forEach((report) => {
      const date = report.startTime.split(" ")[0];
      if (!groupedReports[date]) groupedReports[date] = [];
      groupedReports[date].push(report);
    });

    const allDates = Object.keys(groupedReports).sort(
      (a, b) => new Date(b) - new Date(a)
    );

    return (
      <>
        {allDates.map((date) => (
          <Box key={date} sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                mt: 2,
                mb: 1,
                fontWeight: "bold",
                color: "#1976d2",
                borderBottom: "2px solid #1976d2",
              }}
            >
              Date: {date}
            </Typography>

            <TableContainer component={Paper} elevation={3}>
              <Table>
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
                        sx={{ color: "white", fontWeight: "bold" }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupedReports[date].map((report, i) => (
                    <TableRow
                      key={report._id}
                      sx={{
                        backgroundColor: i % 2 === 0 ? "#f5f5f5" : "white",
                      }}
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
        ))}
        {/* Pagination for 2hr */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={twoHourTotalPages}
            page={twoHourPage}
            onChange={(e, value) => setTwoHourPage(value)}
            color="primary"
          />
        </Box>
      </>
    );
  };

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884d8",
    "#d84f4f",
  ];

  const renderPieChart = (title, data, isPercentage = false) => (
    <Box
      sx={{
        width: { xs: "100%", sm: "300px", md: "320px" },
        height: { xs: 200, sm: 280, md: 300 },
        mb: 6,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          mb: 2,
          fontSize: { xs: "14px", sm: "16px", md: "18px" },
          textAlign: "center",
        }}
      >
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            // label={({ name }) => name}
            outerRadius="80%"
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload.length) return null;
              const item = payload[0];
              return (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "white",
                    p: 1,
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  <p>
                    <strong>Time : </strong>
                    {item.name}
                  </p>
                  <div>
                    <strong>{item.dataKey} : </strong>
                    <strong>
                      {isPercentage
                        ? ` ${item.value.toFixed(2)}%`
                        : ` ${item.value.toFixed(2)}`}
                    </strong>
                  </div>
                </Box>
              );
            }}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{
              fontSize: "12px",
              fontWeight: "bold",
              paddingTop: 10,
              paddingLeft: 10,
              paddingRight: 10,
              display: "flex",
              flexWrap: "wrap", // 🔁 This allows the items to wrap
              justifyContent: "center",
              maxWidth: "90%", // 🔒 Prevents overflow
              margin: "auto",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </Box>
  );

  const renderDailyTable = () => {
    return (
      <>
        {dailyReports.map((report) => {
          const pollutantDist = {};
          const aqiDist = [];
          const powerDist = [];

          report.quarters.forEach((q, idx) => {
            pollutantDist[q.dominantPollutant] =
              (pollutantDist[q.dominantPollutant] || 0) + 1;

            const start = q.startTime?.split(" ")[1]?.slice(0, 5) || "N/A";
            const end = q.endTime?.split(" ")[1]?.slice(0, 5) || "N/A";
            aqiDist.push({ name: `${start}-${end}`, value: q.avgAQI });

            powerDist.push({
              name: `${start}-${end}`,
              value: parseFloat(q.powerConsumption),
            });
          });

          const pollutantData = Object.entries(pollutantDist).map(
            ([name, value]) => ({ name, value })
          );

          return (
            <Accordion key={report._id} sx={{ mb: 2 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography fontWeight="bold" color="#1976d2">
                  {report.date}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <TableContainer component={Paper} elevation={3}>
                  <Table>
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
                            sx={{ color: "white", fontWeight: "bold" }}
                          >
                            {header}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {report.quarters.map((q, i) => (
                        <TableRow
                          key={q._id || i}
                          sx={{
                            backgroundColor: i % 2 === 0 ? "#f5f5f5" : "white",
                          }}
                        >
                          <TableCell>{formatTime(q.startTime)}</TableCell>
                          <TableCell>{formatTime(q.endTime)}</TableCell>
                          <TableCell
                            sx={{
                              color: getAQIColor(q.avgAQI),
                              fontWeight: "bold",
                            }}
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
                            sx={{
                              color: getAQIColor(q.avgAQI),
                              fontWeight: "bold",
                            }}
                          >
                            {q.summary}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    flexWrap: "wrap",

                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 4,
                    mt: 4,
                    px: 2,
                  }}
                >
                  {renderPieChart(
                    "Dominant Pollutant Distribution",
                    pollutantData,
                    true
                  )}
                  {renderPieChart("Average AQI by Quarter", aqiDist)}
                  {renderPieChart("Power Consumption by Quarter", powerDist)}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <Pagination
            count={dailyTotalPages}
            page={dailyPage}
            onChange={(e, value) => setDailyPage(value)}
            color="primary"
          />
        </Box>
      </>
    );
  };

  const renderAQILegend = () => (
    <Box
      sx={{
        mb: 3,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
      }}
    >
      {Object.entries(AQI_LEVELS).map(([level, { label, color }]) => (
        <Box
          key={level}
          sx={{ display: "flex", alignItems: "center", mr: 2, mb: 1 }}
        >
          <Box
            sx={{
              width: 20,
              height: 20,
              backgroundColor: color,
              marginRight: 1,
              borderRadius: "10%",
            }}
          />
          <Typography sx={{ fontSize: "12px" }}>{label}</Typography>
        </Box>
      ))}
    </Box>
  );

  return (
    <Box p={4}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
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
          }}
        >
          Air Quality Reports
        </Typography>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={(_, newView) => newView && setView(newView)}
          sx={{ height: { xs: 40, sm: 56 } }}
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

      {renderAQILegend()}

      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : view === "2hr" ? (
        renderTwoHourTable()
      ) : (
        <>{renderDailyTable()}</>
      )}
    </Box>
  );
};

export default Report;
