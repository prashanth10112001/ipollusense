import React, { useMemo } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Divider,
} from "@mui/material";

import { Button } from "@mui/material";

const SensorDataCards = ({
  data,
  currentPage,
  totalPages,
  onPageChange,
  isDefaultView,
}) => {
  const formattedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      index: index + 1,
      timestamp: new Date(item.activityData.timestamp).toLocaleString(),
      calculatedAQI: Math.max(
        item?.activityData?.calculated?.aqi_co || 0,
        item?.activityData?.calculated?.aqi_dust || 0,
        item?.activityData?.calculated?.aqi_co2 || 0,
        item?.activityData?.calculated?.aqi_voc || 0
      ),
      predictedAQI: Math.max(
        item?.activityData?.predicted?.aqi_co || 0,
        item?.activityData?.predicted?.aqi_dust || 0
      ),
    }));
  }, [data]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(null, currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(null, currentPage + 1);
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#3d728a",
        borderRadius: "10px",
        p: 3,
        mb: 1,
        maxHeight: "490px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
          width: "8px",
        },
        "&::-webkit-scrollbar-track": {
          background: "#f1f1f1",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#888",
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#555",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "#66abef",
          fontWeight: "bold",
          textAlign: "center",
        }}
      >
        SENSOR DATA
      </Typography>

      <Grid container spacing={3}>
        {formattedData.map((item) => (
          <Grid item xs={12} sm={6} md={12} key={item.index}>
            <Card
              sx={{
                p: 2,
                backgroundColor: "#f1df72",
                borderRadius: "10px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                position: "relative",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "#29b6f6",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                  zIndex: 1,
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ color: "#ffffff", fontWeight: "bold" }}
                >
                  {item.index}
                </Typography>
              </Box>
              <CardContent sx={{ pt: 5 }}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      Temperature:
                    </Typography>
                    <Typography variant="body2">
                      {item?.activityData?.data?.temperature || 0} °C
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#1976d2", mt: 1 }}
                    >
                      Humidity:
                    </Typography>
                    <Typography variant="body2">
                      {item?.activityData?.data?.humidity || 0} %
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#1976d2" }}
                    >
                      PM2.5:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ff7043" }}>
                      {item?.activityData?.data?.pm2_5 || 0} µg/m³
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#1976d2", mt: 1 }}
                    >
                      PM10:
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#ff8a65" }}>
                      {item?.activityData?.data?.pm10 || 0} µg/m³
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#d32f2f" }}
                    >
                      AQI (Calculated):
                    </Typography>
                    <Typography variant="body2">
                      {item?.calculatedAQI || 0}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: "bold", color: "#616161" }}
                    >
                      AQI (Predicted):
                    </Typography>
                    <Typography variant="body2">
                      {item?.predictedAQI || 0}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: "center",
                    color: "#616161",
                    fontStyle: "italic",
                  }}
                >
                  Last Updated: {item?.timestamp || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          sx={{ mr: 2 }}
        >
          Prev
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default SensorDataCards;
