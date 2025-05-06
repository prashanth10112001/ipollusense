import { Box } from "@mui/material";

/**
 * AQI level mapping based on value ranges.
 * Each level includes a label, color, and emoji image filename.
 */
const AQI_LEVELS = {
  1: { label: "Good", color: "#00E400", image: "1.png" },
  2: { label: "Moderate", color: "#FFFF00", image: "2.png" },
  3: { label: "Satisfactory", color: "#FF7E00", image: "3.png" },
  4: { label: "Poor", color: "#FF0000", image: "4.png" },
  5: { label: "Very Poor", color: "#8F3F97", image: "5.png" },
  6: { label: "Severe", color: "#7E0023", image: "6.png" },
};

/**
 * Default fallback status for unrecognized AQI values.
 */
const DEFAULT_AQI_STATUS = {
  label: "Unknown",
  color: "#9e9e9e",
  image: "7.png",
};

/**
 * Returns the AQI status object containing:
 * - status: human-readable label
 * - emoji: JSX image component for display
 * - color: associated status color
 *
 * @param {number} aqiValue - AQI index value (1 to 6)
 * @returns {Object} status info for given AQI level
 */
const getAQIStatus = (aqiValue) => {
  // ─── State Management ─────────────────────────────────────────────

  const { label, color, image } = AQI_LEVELS[aqiValue] || DEFAULT_AQI_STATUS;

  return {
    status: label,
    color,
    emoji: (
      <Box
        component="img"
        src={`/assets/${image}`}
        alt={label}
        sx={{
          height: "10rem",
          maxWidth: "25rem",
          borderRadius: "16px",
          objectFit: "cover",
        }}
      />
    ),
  };
};

export default getAQIStatus;
