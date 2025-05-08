import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { FiCloud } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import AtAGlanceCard from "../components/AtAGlanceCard";
import GraphWithFeatureSelection from "../components/GraphWithFeatureSelection";
import SensorDataCards from "../components/SensorDataCards";
import AboutProjectModel from "../components/AboutProjectModel";
import Navbar from "../components/Navbar";

const API_URL = "http://localhost:3500/api/node/"; // Default API for recent data
const FILTERED_API_URL = "http://localhost:3500/api/node/filter"; // New API for filtered data based on date

// const API_URL = "http://52.250.54.24:3500/api/node/"; // Default API for recent data
// const FILTERED_API_URL = "http://52.250.54.24:3500/api/node/filter"; // New API for filtered data based on date

// Fetch Sensor Data
const fetchSensorData = async (
  page,
  startDate,
  endDate,
  nodeValue,
  isSubmitClicked
) => {
  try {
    const params = {
      page: parseInt(page, 10),
      limit: 10,
      nodeValue: nodeValue,
    };
    const url = isSubmitClicked ? FILTERED_API_URL : API_URL; // Choose API based on date range

    // if (isSubmitClicked) {
    //   const response = await axios.post(url, {
    //     startDate,
    //     endDate,
    //     nodeValue,
    //     page: parseInt(page, 10), // ✅ Add this line
    //     limit: 10, // ✅ Also add limit if your backend needs it
    //   });

    if (isSubmitClicked) {
      const response = await axios.post(`${url}?page=${page}&limit=10`, {
        startDate,
        endDate,
        nodeValue,
      });
      // console.log("response", response);

      if (response.status === 304) {
        console.log("Data not modified since last request.");
        return;
      }

      const { data, currentPage, totalPages } = response.data;
      return { data, currentPage, totalPages };
    } else {
      // Fetch recent data (GET request)
      const response = await axios.get(url, {
        params,
      });
      const { data, currentPage, totalPages } = response.data;
      return { data, currentPage, totalPages };
    }
  } catch (err) {
    throw new Error("Data fetch failed");
  }
};

const Dashboard = ({ setSensorDataInApp }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formStartDate, setFormStartDate] = useState("");
  const [formEndDate, setFormEndDate] = useState("");
  const [nodeValue, setNodeValue] = useState(1192); // Store the nodeValue selected by user
  const [isDefaultView, setIsDefaultView] = useState(true); // Default view is true
  const [isSubmitClicked, setIsSubmitClicked] = useState(false); // Track if submit button was clicked
  //   const [viewType, setViewType] = useState("indoor"); // Default view is indoor AQI
  const [errorMessage, setErrorMessage] = useState(""); // Error message state
  const [isRecent, setIsRecent] = useState(true); // Track if recent button was clicked

  const {
    data: sensorData,
    error,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["sensorData", currentPage, startDate, endDate, nodeValue],
    queryFn: () =>
      fetchSensorData(
        currentPage,
        startDate,
        endDate,
        nodeValue,
        isSubmitClicked
      ),
    enabled: true,
    keepPreviousData: true,
    refetchInterval: 1500, // Keep fetching every 15 seconds
  });

  // Handle the pagination
  const handlePageChange = (event, newPage) => {
    console.log("Page change triggered. New page:", newPage);

    setCurrentPage(newPage);
  };

  useEffect(() => {
    console.log("Current page updated:", currentPage);
  }, [currentPage]);

  const getFilteredSensorData = () => {
    if (isDefaultView && isSuccess) {
      return sensorData?.data || [];
    } else {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      const nv = nodeValue;

      //   const filteredData =
      //     sensorData?.data?.filter(({ nodeValue, createdAt }) => {
      //       const itemDate = new Date(createdAt).getTime();
      //       return (
      //         nv === parseInt(nodeValue) && itemDate >= start && itemDate <= end
      //       );
      //     }) || [];

      return (
        sensorData?.data?.filter(({ nodeValue: nv, createdAt }) => {
          const itemDate = new Date(createdAt).getTime();
          return (
            nv === parseInt(nodeValue) && itemDate >= start && itemDate <= end
          );
        }) || []
      );
    }
  };

  const getGraphData = () => {
    const filteredData = getFilteredSensorData();

    return filteredData.map(
      ({
        activityData: { timestamp, data, calculated, predicted },
        createdAt,
      }) => ({
        timestamp,
        createdAt,
        pm2_5: data?.pm2_5 || 0,
        pm10: data?.pm10 || 0,
        pm1: data?.pm1 || 0,
        temperature: data?.temperature || 0,
        humidity: data?.humidity || 0,
        co: data?.co || 0,
        voc: data?.voc || 0,
        co2: data?.co2 || 0,
        no2: data?.no2 || 0,
        aqi_calc: Math.max(
          calculated?.aqi_co || 0,
          calculated?.aqi_dust || 0,
          calculated?.aqi_co2 || 0,
          calculated?.aqi_voc || 0
        ),
        aqi_pred: Math.max(predicted?.aqi_co, predicted?.aqi_dust),
      })
    );
  };

  const handleDateFields = () => {
    setIsRecent(false);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = "00";
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSubmit = () => {
    if (new Date(formStartDate) >= new Date(formEndDate)) {
      setErrorMessage("Start date must be less than end date.");
      return;
    }
    setErrorMessage(""); // Clear any previous error messages
    setStartDate(formatDateTime(formStartDate)); // Format the start date
    setEndDate(formatDateTime(formEndDate)); // Format the end date
    setIsDefaultView(false); // Set default view to false after submit
    setIsSubmitClicked(true); // Mark submit as clicked
  };

  // Handle submit action to update the default view and fetch data
  // const handleSubmit = () => {
  //   if (new Date(formStartDate) >= new Date(formEndDate)) {
  //     setErrorMessage("Start date must be less than end date.");
  //     return;
  //   }
  //   setErrorMessage(""); // Clear any previous error messages
  //   setStartDate(formStartDate); // Set the start date
  //   setEndDate(formEndDate); // Set the end date
  //   setIsDefaultView(false); // Set default view to false after submit
  //   setIsSubmitClicked(true); // Mark submit as clicked
  // };

  // Reset the view to default
  const handleReset = () => {
    setIsDefaultView(true);
    setIsSubmitClicked(false);
    setStartDate("");
    setEndDate("");
    setFormStartDate("");
    setFormEndDate("");
    setNodeValue(1192);
    setErrorMessage(""); // Clear any previous error messages
    setCurrentPage(1);
    setIsRecent(true);
  };

  // Get status messages for the most recent sensor data
  const getStatusMessages = () => {
    const defaultStatus = {
      coStatus: "Loading...",
      no2Status: "Loading...",
      dustStatus: "Loading...",
      temperature: "N/A",
      humidity: "N/A",
      pressure: "N/A",
      co2: "N/A",
      no2: "N/A",
      co: "N/A",
      voc: "N/A",
      dust: "N/A",
      pm10: "N/A",
      pm25: "N/A",
      pm1: "N/A",
    };

    const mostRecentItem = sensorData?.data?.[0];

    if (!mostRecentItem?.activityData) return defaultStatus;

    const { status = {}, data = {} } = mostRecentItem.activityData;

    return {
      // coStatus: status.co === -1 ? "Faulty" : "OK",
      // dustStatus: status.dust === -1 ? "Faulty" : "OK",
      coStatus: status.co,
      no2Status: status.no2,
      dustStatus: status.dust,
      temperature: data.temperature ?? "N/A",
      humidity: data.humidity ?? "N/A",
      pressure: data.pressure ?? "N/A",
      co2: data.co2 ?? "N/A",
      no2: data.no2 ?? "N/A",
      co: data.co ?? "N/A",
      voc: data.voc ?? "N/A",
      dust: data.dust ?? "N/A",
      pm10: data.pm10 ?? "N/A",
      pm25: data.pm2_5 ?? "N/A",
      pm1: data.pm1 ?? "N/A",
    };
  };

  const {
    coStatus,
    no2Status,
    dustStatus,
    temperature,
    humidity,
    pressure,
    co2,
    no2,
    co,
    voc,
    dust,
    pm10,
    pm25,
    pm1,
  } = getStatusMessages();

  // Get AQI for indoor and outdoor
  const getIndoorAQI = () => {
    const mostRecentItem = sensorData?.data?.[0];
    if (mostRecentItem) {
      const { aqi_dust, aqi_co, aqi_voc, aqi_co2 } =
        mostRecentItem?.activityData?.calculated || {};
      return Math.max(aqi_dust, aqi_co, aqi_voc, aqi_co2);
    }
    return "Loading...";
  };

  const getOutdoorAQI = () => {
    const mostRecentItem = sensorData?.data?.[0];
    if (mostRecentItem) {
      const { aqi_dust, aqi_co } =
        mostRecentItem?.activityData?.calculated || {};
      return Math.max(aqi_dust, aqi_co);
    }
    return "Loading...";
  };

  const indoorAQI = getIndoorAQI();
  const outdoorAQI = getOutdoorAQI();

  return (
    <div style={{ backgroundColor: "#F5F5F5", width: "100%" }}>
      {/* <AppBar position="static" style={{ backgroundColor: "#1565C0" }}>
        <Toolbar>
          <FiCloud
            size={30}
            style={{ marginRight: "10px", color: "#ffffff" }}
          />
          <Typography variant="h6" component="div" style={{ flexGrow: 1 }}>
            iPolluSense - Air Quality Monitoring
          </Typography>
          <Typography variant="body2">
            {isLoading
              ? "Loading..."
              : `Updated ${Math.floor(
                  (Date.now() -
                    new Date(sensorData?.data?.[0]?.updatedAt).getTime()) /
                    1000
                )} seconds ago`}
          </Typography>
        </Toolbar>
      </AppBar> */}

      <Navbar isLoading={isLoading} sensorData={sensorData} />

      <div>
        <AtAGlanceCard
          temperature={temperature}
          humidity={humidity}
          pressure={pressure}
          co2={co2}
          no2={no2}
          co={co}
          voc={voc}
          dust={dust}
          pm10={pm10}
          pm25={pm25}
          pm1={pm1}
          dustStatus={dustStatus}
          coStatus={coStatus}
          no2Status={no2Status}
          indoorAQI={indoorAQI}
          outdoorAQI={outdoorAQI}
          lastUpdatedMessage={
            isLoading
              ? "Loading..."
              : `Updated ${Math.floor(
                  (Date.now() -
                    new Date(sensorData?.data?.[0]?.updatedAt).getTime()) /
                    1000
                )} seconds ago`
          }
        />
      </div>

      {/*try start*/}
      <Box
        sx={{
          padding: "20px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            label="Node Value"
            value={nodeValue}
            onChange={(e) => {
              setNodeValue(e.target.value);
              setIsRecent(true);
            }}
            size="medium"
            style={{ width: "50%", marginRight: "10px" }}
          />

          <Button
            variant={isRecent ? "contained" : "outlined"}
            color="secondary"
            onClick={handleReset}
            size="large"
            style={{ marginRight: "10px" }}
          >
            Recent Data
          </Button>
          <Button
            variant={isRecent ? "outlined" : "contained"}
            color="secondary"
            size="large"
            onClick={handleDateFields}
            style={{ marginRight: "10px" }}
          >
            Historical Data
          </Button>
        </Box>
        {!isRecent && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <TextField
              label="Start Date"
              type="datetime-local"
              value={formStartDate}
              onChange={(e) => setFormStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              style={{ marginRight: "10px" }}
            />
            <TextField
              label="End Date"
              type="datetime-local"
              value={formEndDate}
              onChange={(e) => setFormEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              size="large"
              style={{ marginLeft: "10px" }}
            >
              Submit
            </Button>
          </Box>
        )}
        {errorMessage && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" color="error">
              {errorMessage}
            </Typography>
          </Box>
        )}
        {/* Display error message if data fetching fails */}
        {isError && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Typography variant="body2" color="error">
              {error.message}
            </Typography>
          </Box>
        )}
      </Box>
      {/*try end* /}
      {/* Date Range Inputs */}
      <Box
        sx={{
          padding: "20px",
        }}
      >
        {/* Graph and Sensor Data Cards Side by Side */}
        <Grid container spacing={3} alignItems="flex-end">
          <Grid item xs={12} md={8}>
            <GraphWithFeatureSelection
              data={getGraphData()}
              startDate={startDate}
              endDate={endDate}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <SensorDataCards
              data={getFilteredSensorData()}
              currentPage={currentPage}
              totalPages={sensorData?.totalPages || 1}
              onPageChange={handlePageChange}
              isDefaultView={isDefaultView}
            />
          </Grid>
        </Grid>
      </Box>

      {/* Include the AboutProjectModal widget */}
      <AboutProjectModel />
    </div>
  );
};

export default Dashboard;
