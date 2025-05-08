// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import { fetchTwoHourReports } from "../services/api";

// const Report = () => {
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getReports = async () => {
//     try {
//       const res = await fetchTwoHourReports();
//       setReports(res.data);
//       setLoading(false);
//     } catch (err) {
//       console.error("Failed to fetch reports", err);
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getReports();
//     const intervalId = setInterval(getReports, 60000); // refresh every 60s
//     return () => clearInterval(intervalId);
//   }, []);

//   if (loading) {
//     return (
//       <Box display="flex" justifyContent="center" mt={5}>
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <Box p={4}>
//       <Typography variant="h4" gutterBottom>
//         2-Hour AQI Reports
//       </Typography>

//       {reports.length === 0 ? (
//         <Typography variant="h6" color="textSecondary" mt={3}>
//           No data available.
//         </Typography>
//       ) : (
//         <TableContainer component={Paper} elevation={3}>
//           <Table sx={{ minWidth: 1200 }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>
//                   <strong>Report ID</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Device ID</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Start Time</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>End Time</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Avg AQI</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Temperature (°C)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Humidity (%)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Dominant Pollutant</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Power Consumption (kWh)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Summary</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reports.map((report) => (
//                 <TableRow key={report._id}>
//                   <TableCell>{report.reportId}</TableCell>
//                   <TableCell>{report.device_id}</TableCell>
//                   <TableCell>
//                     {new Date(report.startTime).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     {new Date(report.endTime).toLocaleString()}
//                   </TableCell>
//                   <TableCell>{report.avgAQI.toFixed(2)}</TableCell>
//                   <TableCell>{report.avgTemperature.toFixed(1)}</TableCell>
//                   <TableCell>{report.avgHumidity.toFixed(1)}</TableCell>
//                   <TableCell>{report.dominantPollutant}</TableCell>
//                   <TableCell>
//                     {report.powerConsumption.toFixed(2)} kWh
//                   </TableCell>{" "}
//                   {/* Display power consumption */}
//                   <TableCell>{report.summary}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default Report;

// import React from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
// } from "@mui/material";

// const Report = () => {
//   // Static data for demonstration
//   const reports = [
//     {
//       _id: "1",
//       reportId: "RPT001",
//       device_id: "1192",
//       startTime: "2025-05-01T08:00:00",
//       endTime: "2025-05-01T10:00:00",
//       avgAQI: 75.5,
//       avgTemperature: 23.4,
//       avgHumidity: 45.6,
//       dominantPollutant: "PM2.5",
//       powerConsumption: 12.34,
//       summary: "Air quality is within safe limits.",
//     },
//     {
//       _id: "2",
//       reportId: "RPT002",
//       device_id: "1192",
//       startTime: "2025-05-01T10:00:00",
//       endTime: "2025-05-01T12:00:00",
//       avgAQI: 88.1,
//       avgTemperature: 22.1,
//       avgHumidity: 50.3,
//       dominantPollutant: "NO2",
//       powerConsumption: 15.12,
//       summary: "Moderate pollution levels.",
//     },
//   ];

//   return (
//     <Box p={4}>
//       <Typography
//         variant="h4"
//         gutterBottom
//         sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
//       >
//         AQI Reports ( For every 2 hours)
//       </Typography>

//       {reports.length === 0 ? (
//         <Typography variant="h6" color="textSecondary" mt={3}>
//           No data available.
//         </Typography>
//       ) : (
//         <TableContainer component={Paper} elevation={3}>
//           <Table sx={{ minWidth: 1200 }}>
//             <TableHead>
//               <TableRow>
//                 <TableCell>
//                   <strong>Report ID</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Device ID</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Start Time</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>End Time</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Avg AQI</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Temperature (°C)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Humidity (%)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Dominant Pollutant</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Power Consumption (kWh)</strong>
//                 </TableCell>
//                 <TableCell>
//                   <strong>Summary</strong>
//                 </TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {reports.map((report) => (
//                 <TableRow key={report._id}>
//                   <TableCell>{report.reportId}</TableCell>
//                   <TableCell>{report.device_id}</TableCell>
//                   <TableCell>
//                     {new Date(report.startTime).toLocaleString()}
//                   </TableCell>
//                   <TableCell>
//                     {new Date(report.endTime).toLocaleString()}
//                   </TableCell>
//                   <TableCell>{report.avgAQI.toFixed(2)}</TableCell>
//                   <TableCell>{report.avgTemperature.toFixed(1)}</TableCell>
//                   <TableCell>{report.avgHumidity.toFixed(1)}</TableCell>
//                   <TableCell>{report.dominantPollutant}</TableCell>
//                   <TableCell>
//                     {report.powerConsumption.toFixed(2)} kWh
//                   </TableCell>
//                   <TableCell>{report.summary}</TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       )}
//     </Box>
//   );
// };

// export default Report;

import React, { useEffect, useState } from "react";
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

  const REPORT_URL = "http://localhost:3500/api/reports/"; // Default API for recent data

  const fetchReports = async () => {
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
  };

  useEffect(() => {
    fetchReports(); // initial fetch

    const interval = setInterval(() => {
      console.log("Checking for new reports...");
      fetchReports();
      // }, 5 * 60 * 1000); // every 5 minutes
    }, 1 * 60 * 1000); // every 5 minutes

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

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
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Device ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Start Time</strong>
                </TableCell>
                <TableCell>
                  <strong>End Time</strong>
                </TableCell>
                <TableCell>
                  <strong>Avg AQI</strong>
                </TableCell>
                <TableCell>
                  <strong>Temperature (°C)</strong>
                </TableCell>
                <TableCell>
                  <strong>Humidity (%)</strong>
                </TableCell>
                <TableCell>
                  <strong>Dominant Pollutant</strong>
                </TableCell>
                <TableCell>
                  <strong>Power Consumption (kWh)</strong>
                </TableCell>
                <TableCell>
                  <strong>Summary</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report._id}>
                  <TableCell>{report.nodeValue}</TableCell>
                  <TableCell>
                    {new Date(report.startTime).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(report.endTime).toLocaleString()}
                  </TableCell>
                  <TableCell>{report.avgAQI.toFixed(2)}</TableCell>
                  <TableCell>{report.avgTemperature.toFixed(1)}</TableCell>
                  <TableCell>{report.avgHumidity.toFixed(1)}</TableCell>
                  <TableCell>{report.dominantPollutant}</TableCell>
                  <TableCell>{report.powerConsumption} kWh</TableCell>
                  <TableCell>{report.summary}</TableCell>
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
