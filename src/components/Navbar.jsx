import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCloud } from "react-icons/fi";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";

function Navbar({ isLoading, sensorData }) {
  const location = useLocation();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is small

  const getLastUpdatedMessage = () => {
    const lastUpdated = sensorData?.data?.[0]?.updatedAt;
    if (!lastUpdated) return "No update yet";

    const secondsAgo = Math.floor(
      (Date.now() - new Date(lastUpdated).getTime()) / 1000
    );
    return `Updated ${secondsAgo} seconds ago`;
  };

  return (
    <AppBar
      position="sticky"
      style={{
        backgroundColor: "#1565C0",
        padding: isSmallScreen ? "0 5px" : "0 10px",
      }}
    >
      <Toolbar
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            color: "white",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FiCloud
            size={30}
            style={{ marginRight: isSmallScreen ? "5px" : "10px" }}
          />
          <Typography
            variant="h6"
            component="div"
            style={{
              fontWeight: "bold",
              fontSize: isSmallScreen ? "10px" : "18px", // Adjust font size for small screens
            }}
          >
            iPolluSense - Air Quality Monitoring
          </Typography>
        </Link>

        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to="/"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: isSmallScreen ? "10px" : "20px",
              fontWeight: "500",
              padding: isSmallScreen ? "5px 10px" : "8px 16px",
              borderRadius: "5px",
              transition: "background-color 0.3s ease",
            }}
          >
            <Button
              variant="text"
              style={{
                color: "white",
                fontWeight: "500",
                textTransform: "none",
                fontSize: isSmallScreen ? "12px" : "16px", // Adjust font size for small screens
              }}
            >
              Home
            </Button>
          </Link>
          <Link
            to="/report"
            style={{
              color: "white",
              textDecoration: "none",
              marginRight: isSmallScreen ? "10px" : "20px",
              fontWeight: "500",
              padding: isSmallScreen ? "5px 10px" : "8px 16px",
              borderRadius: "5px",
              transition: "background-color 0.3s ease",
            }}
          >
            <Button
              variant="text"
              style={{
                color: "white",
                fontWeight: "500",
                textTransform: "none",
                fontSize: isSmallScreen ? "12px" : "16px", // Adjust font size for small screens
              }}
            >
              Report
            </Button>
          </Link>

          {location.pathname === "/" && (
            <Typography
              variant="body2"
              style={{
                color: "white",
                fontSize: isSmallScreen ? "10px" : "14px", // Adjust font size for small screens
              }}
            >
              {isLoading ? "Loading..." : getLastUpdatedMessage()}
            </Typography>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
