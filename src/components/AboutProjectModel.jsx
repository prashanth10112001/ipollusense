// ==============================
// Imports
// ==============================
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InfoIcon from "@mui/icons-material/Info";

// ==============================
// AboutProjectModal Component
// ==============================
const AboutProjectModal = () => {
  // ==============================
  // Local State
  // ==============================
  const [open, setOpen] = useState(false);

  // ==============================
  // Event Handlers
  // ==============================
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // ==============================
  // Render
  // ==============================
  return (
    <>
      {/* ===== Floating Info Button ===== */}
      <Fab
        color="secondary"
        onClick={handleOpen}
        sx={{
          position: "fixed",
          bottom: 20,
          right: 20,
          boxShadow: 3,
        }}
      >
        <InfoIcon />
      </Fab>

      {/* ===== Project Info Modal ===== */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        sx={{
          "& .MuiDialogPaper-root": {
            borderRadius: 4,
            boxShadow: 10,
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        {/* ---- Dialog Title ---- */}
        <DialogTitle
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            padding: "16px 24px",
          }}
        >
          About The Project
        </DialogTitle>

        {/* ---- Dialog Content ---- */}
        <DialogContent
          dividers
          sx={{ padding: "20px", backgroundColor: "#fafafa" }}
        >
          {/* ===== Embedded Video Section ===== */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: "20px",
            }}
          >
            <video
              controls
              preload="metadata"
              poster="thumbnail.png"
              style={{
                maxWidth: "80%",
                borderRadius: 8,
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              }}
            >
              <source src="video.mp4" type="video/mp4" />
            </video>
          </div>

          {/* ===== Accordion: Objectives ===== */}
          <Accordion sx={{ marginBottom: "16px", borderRadius: "8px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              <Typography variant="h6">Our Objectives</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#e3f2fd" }}>
              <ul>
                <li>Monitor PM 2.5, PM 10, CO, NO₂, VOC, and C₂H₅OH levels.</li>
                <li>Use meteorological data to predict AQI using ML models.</li>
                <li>Cloud-synced dashboard for live air quality display.</li>
                <li>Voice assistant that reports real-time AQI data.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          {/* ===== Accordion: Challenges / Known Issues ===== */}
          <Accordion sx={{ marginBottom: "16px", borderRadius: "8px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              <Typography variant="h6">Challenges / Known Issues</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#e3f2fd" }}>
              <ul>
                <li>Sensors require precise calibration in lab conditions.</li>
                <li>Separate ML models per sensor increase computation.</li>
                <li>Reducing size while allowing airflow is difficult.</li>
                <li>Local pollution differences require custom modeling.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          {/* ===== Accordion: Future Goals ===== */}
          <Accordion sx={{ marginBottom: "16px", borderRadius: "8px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              <Typography variant="h6">Future Goals</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#e3f2fd" }}>
              <ul>
                <li>Auto-recalibrate sensors using secondary sensing.</li>
                <li>Track noise pollution alongside air data.</li>
                <li>Mobile app for health and travel advice.</li>
                <li>Add Bluetooth support & cloud flexibility.</li>
                <li>Personalizable smart voice assistant.</li>
              </ul>
            </AccordionDetails>
          </Accordion>

          {/* ===== Accordion: What is AQI ===== */}
          <Accordion sx={{ marginBottom: "16px", borderRadius: "8px" }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: "#1976d2", color: "white" }}
            >
              <Typography variant="h6">What is AQI</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: "#e3f2fd" }}>
              <Typography paragraph>
                An Air Quality Index (AQI) indicates how polluted the air
                currently is or is forecast to be. It is based on concentrations
                of various air pollutants.
              </Typography>

              {/* ---- AQI Table ---- */}
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    minWidth: "500px",
                    borderCollapse: "collapse",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          padding: "8px",
                        }}
                      >
                        AQI Category
                      </th>
                      <th
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          padding: "8px",
                        }}
                      >
                        PM₂.₅
                      </th>
                      <th
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          padding: "8px",
                        }}
                      >
                        PM₁₀
                      </th>
                      <th
                        style={{
                          backgroundColor: "#1976d2",
                          color: "white",
                          padding: "8px",
                        }}
                      >
                        CO
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        Good (0–50)
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        0–30
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        0–50
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        0–1.0
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        Satisfactory (51–100)
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        31–60
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        51–100
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        1.1–2.0
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        Moderate (101–200)
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        61–90
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        101–250
                      </td>
                      <td style={{ padding: "8px", textAlign: "center" }}>
                        2.1–10
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </AccordionDetails>
          </Accordion>
        </DialogContent>

        {/* ===== Modal Footer / Actions ===== */}
        <DialogActions sx={{ backgroundColor: "#1976d2", padding: "16px" }}>
          <Button
            onClick={handleClose}
            color="secondary"
            variant="contained"
            sx={{ borderRadius: 4 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AboutProjectModal;
