import React from "react";
import { FiCloud } from "react-icons/fi";
import { AppBar, Toolbar, Typography } from "@mui/material";

function Navbar({ isLoading, sensorData }) {
  return (
    <>
      <AppBar position="static" style={{ backgroundColor: "#1565C0" }}>
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
      </AppBar>
    </>
  );
}

export default Navbar;
