import React, { useState, useMemo } from "react";
import {
  Typography,
  Box,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";

import getAQIStatus from "./getAQIStatus";

// AQI mapping utility
function aqi(concentration, pollutant) {
  const lookupTable = {
    pm10: [
      [-1, 50],
      [51, 100],
      [101, 250],
      [251, 350],
      [351, 430],
      [430, Infinity],
    ],
    pm2_5: [
      [-1, 30],
      [31, 60],
      [61, 90],
      [91, 120],
      [121, 250],
      [250, Infinity],
    ],
    co: [
      [-1, 1.0],
      [1.0, 2.0],
      [2.0, 10],
      [10, 17],
      [17, 34],
      [34, Infinity],
    ],
    voc: [
      [-1, 0.3],
      [0.3, 0.5],
      [0.5, 0.8],
      [0.8, 1.0],
      [1.0, 3.0],
      [3.0, Infinity],
    ],
    co2: [
      [-1, 400],
      [400, 1000],
      [1000, 1500],
      [1500, 2000],
      [2000, 5000],
      [5000, Infinity],
    ],
    no2: [
      [-1, 100],
      [100, 200],
      [200, 400],
      [400, 600],
      [600, 800],
      [800, Infinity],
    ],
  };

  const colors = [
    "#00E400",
    "#FFFF00",
    "#FF7E00",
    "#FF0000",
    "#8F3F97",
    "#7E0023",
  ];

  // Handle invalid or "N/A" concentration
  if (
    concentration == null ||
    concentration === "N/A" ||
    isNaN(concentration)
  ) {
    return { aqi: -1, color: "#9fa59f" }; // Default color for invalid data
  }

  if (lookupTable.hasOwnProperty(pollutant)) {
    const ranges = lookupTable[pollutant];
    for (let i = 0; i < ranges.length; i++) {
      if (concentration > ranges[i][0] && concentration <= ranges[i][1]) {
        return { aqi: i + 1, color: colors[i] };
      }
    }
  }
  return { aqi: -1, color: "#00E400" };
}

const AtAGlanceCard = ({
  temperature,
  humidity,
  co2,
  co,
  no2,
  voc,
  dust,
  pm10,
  pm25,
  pm1,
  dustStatus,
  coStatus,
  vocStatus,
  co2Status,
  no2Status,
  indoorAQI,
  outdoorAQI,
}) => {
  const [viewType, setViewType] = useState("indoor");

  // Get AQI status and related color/emoji based on selected view type
  const { status, emoji, color } = useMemo(
    () => getAQIStatus(viewType === "indoor" ? indoorAQI : outdoorAQI),
    [viewType, indoorAQI, outdoorAQI]
  );

  // Determine overall sensor status card color
  let sensorStatusBackColor = "lightseagreen";
  if (
    dustStatus === -1 ||
    coStatus === -1 ||
    vocStatus === -1 ||
    co2Status === -1
  ) {
    sensorStatusBackColor = "coral";
  } else if (dustStatus > 0 || coStatus > 0 || vocStatus > 0 || co2Status > 0) {
    sensorStatusBackColor = "goldenrod";
  }

  // Determine per-sensor status text and color
  const sensorData = [
    {
      label: "Dust",
      status: dustStatus == null ? "-" : dustStatus === -1 ? "FAULTY" : "OK",
      color:
        dustStatus == null
          ? "#9fa59f"
          : dustStatus === -1
          ? "#FF0000"
          : dustStatus > 0
          ? "#FFFF00"
          : "#00E400",
    },
    {
      label: "CO",
      status: coStatus == null ? "-" : coStatus === -1 ? "FAULTY" : "OK",
      color:
        coStatus == null
          ? "#9fa59f"
          : coStatus === -1
          ? "#FF0000"
          : coStatus > 0
          ? "#FFFF00"
          : "#00E400",
    },
    {
      label: "VOC",
      status: vocStatus == null ? "-" : vocStatus === -1 ? "FAULTY" : "OK",
      color:
        vocStatus == null
          ? "#9fa59f"
          : vocStatus === -1
          ? "#FF0000"
          : vocStatus > 0
          ? "#FFFF00"
          : "#00E400",
    },
    {
      label: "CO2",
      status: co2Status == null ? "-" : co2Status === -1 ? "FAULTY" : "OK",
      color:
        co2Status == null
          ? "#9fa59f"
          : co2Status === -1
          ? "#FF0000"
          : co2Status > 0
          ? "#FFFF00"
          : "#00E400",
    },
    {
      label: "NO2",
      status: no2Status == null ? "-" : no2Status === -1 ? "FAULTY" : "OK",
      color:
        no2Status == null
          ? "#9fa59f"
          : no2Status === -1
          ? "#FF0000"
          : no2Status > 0
          ? "#FFFF00"
          : "#00E400",
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        p: 3,
        borderRadius: 2,
        backgroundColor: "#6cc5de",
        margin: "2rem 1rem",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Section 1: AQI Status Display */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 2,
          backgroundColor: color,
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          LIVE AQI STATUS
        </Typography>
        <Typography variant="h4" fontWeight="bold">
          {status}
        </Typography>
        <Typography
          variant="h1"
          sx={{ fontSize: 130, mt: 1, lineHeight: 0.1067 }}
        >
          {emoji}
        </Typography>

        {/* Indoor/Outdoor Toggle */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <RadioGroup
            row
            value={viewType}
            onChange={(e) => setViewType(e.target.value)}
          >
            <FormControlLabel
              value="indoor"
              control={<Radio />}
              label="Indoor"
            />
            <FormControlLabel
              value="outdoor"
              control={<Radio />}
              label="Outdoor"
            />
          </RadioGroup>
        </Box>

        {/* Display AQI Value */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
            {viewType === "indoor"
              ? `Indoor AQI: ${indoorAQI}`
              : `Outdoor AQI: ${outdoorAQI}`}
          </Typography>
        </Box>
      </Box>

      {/* Section 2: Pollutant and Environment Readings */}
      <Box
        sx={{
          flex: 2,
          p: 3,
          borderRadius: 2,
          backgroundColor: "#a9e1eb",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Current Sensor Readings
        </Typography>

        {/* Pollutants */}
        {[
          { label: "PM2.5", value: pm25, color: aqi(pm25, "pm2_5").color },
          { label: "PM10", value: pm10, color: aqi(pm10, "pm10").color },
          { label: "CO", value: co, color: aqi(co, "co").color },
          { label: "CO2", value: co2, color: aqi(co2, "co2").color },
          { label: "VOC", value: voc, color: aqi(voc, "voc").color },
          {
            label: "NO2",
            value: no2 ? no2 : "-",
            color: aqi(no2, "no2").color,
          },
        ].map((item, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: item.color,
              padding: "8px 12px",
              borderRadius: "5px",
              mb: 1,
            }}
          >
            <Typography fontWeight="bold">{item.label}</Typography>
            <Typography>{item.value}</Typography>
          </Box>
        ))}

        {/* Temperature and Humidity */}
        <Typography
          mt={2}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          <span>
            🌡️ <b>Temperature :</b> {temperature}°C
          </span>
          <span>
            💧 <b>Humidity :</b> {humidity}%
          </span>
        </Typography>

        {/* AQI Color Legend */}
        <Box mt={2} sx={{ display: "flex", flexWrap: "wrap" }}>
          {[
            { label: "Good", color: "#00E400" },
            { label: "Moderate", color: "#FFFF00" },
            { label: "Satisfactory", color: "#FF7E00" },
            { label: "Poor", color: "#FF0000" },
            { label: "Very Poor", color: "#8F3F97" },
            { label: "Severe", color: "#7E0023" },
          ].map((legend, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                mb: 1,
                mr: 1,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: legend.color,
                  borderRadius: "50%",
                  mr: 1,
                }}
              ></Box>
              <Typography sx={{ fontWeight: "bold", fontSize: 12 }}>
                {legend.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Section 3: Sensor Status Display */}
      <Box
        sx={{
          flex: 1,
          p: 3,
          borderRadius: 2,
          backgroundColor: sensorStatusBackColor,
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Sensor Status
        </Typography>

        {/* Individual Sensor Status Cards */}
        {sensorData.map((sensor, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 12px",
              backgroundColor: sensor.color,
              borderRadius: "5px",
              mb: 1,
            }}
          >
            <Typography fontWeight="bold">{sensor.label}</Typography>
            <Typography>{sensor.status}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AtAGlanceCard;
