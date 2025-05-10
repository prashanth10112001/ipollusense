// import React, {
//   useState,
//   useMemo,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import dayjs from "dayjs";
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
// } from "firebase/firestore";

// // Component
// const GraphWithFeatureSelection = ({ data, startDate, endDate }) => {
//   /** ──────── 📦 Constants ──────── */
//   const NODE_ID = 1192;

//   const FEATURE_LIST = useMemo(
//     () => [
//       { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
//       { key: "pm10", label: "PM10", color: "#079220" },
//       { key: "pm1", label: "PM1", color: "#3357FF" },
//       { key: "temperature", label: "Temperature", color: "#D4A302" },
//       { key: "humidity", label: "Humidity", color: "#3C5D01" },
//       { key: "co", label: "CO", color: "#C70039" },
//       { key: "voc", label: "VOC", color: "#900C3F" },
//       { key: "co2", label: "CO2", color: "#581845" },
//       { key: "no2", label: "NO2", color: "#3E0174" },
//       { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
//       { key: "aqi_pred", label: "AQI (Predicted)", color: "#007979" },
//     ],
//     []
//   );

//   /** ──────── 📦 Firebase Configuration ──────── */
//   // const firebaseConfig = {
//   //   apiKey: "AIzaSyCSDU3MoCUfcC3Jfn_T-cZ6fqcp2ZUFFMk",
//   //   authDomain: "ipollusense-52f67.firebaseapp.com",
//   //   projectId: "ipollusense-52f67",
//   //   storageBucket: "ipollusense-52f67.appspot.com",
//   //   messagingSenderId: "733434038670",
//   //   appId: "1:733434038670:web:7e3d9475fd6310d1afbcdf",
//   //   measurementId: "G-VHSG19J7HN",
//   // };
//   const firebaseConfig = {
//     apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
//     authDomain: "ipollusense-annotate.firebaseapp.com",
//     projectId: "ipollusense-annotate",
//     storageBucket: "ipollusense-annotate.firebasestorage.app",
//     messagingSenderId: "121648362000",
//     appId: "1:121648362000:web:e242357f6470f0d4d89095",
//   };

//   /** ──────── 📦 Firebase Initialization ──────── */

//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   /** ──────── 🧠 States ──────── */
//   const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
//   const [originalData, setOriginalData] = useState([]);
//   const [showActualData, setShowActualData] = useState(false);
//   const [timeRange, setTimeRange] = useState("");
//   const [loading, setLoading] = useState(false);
//   const defaultOriginalData = useRef([]);

//   /** ──────── 🎣 Effects ──────── */
//   useEffect(() => {
//     if (!timeRange) {
//       defaultOriginalData.current = data;
//       setOriginalData(data);
//     }
//   }, [data, timeRange]);

//   useEffect(() => {
//     const fetchFirebaseData = async () => {
//       try {
//         // Convert startDate and endDate to Date objects for comparison
//         const start = startDate
//           ? new Date(startDate)
//           : new Date(data[data.length - 1]?.createdAt);
//         const end = endDate ? new Date(endDate) : new Date(data[0]?.createdAt);

//         // console.log("Start Date:", start, "End Date:", end);

//         const checkpointsQuery = query(
//           collection(db, "devices"),
//           orderBy("timestamp", "desc")
//         );
//         let querySnapshot = await getDocs(checkpointsQuery);
//         querySnapshot = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter the querySnapshot based on date range
//         querySnapshot = querySnapshot.filter((dataset) => {
//           // Convert dataset.timestamp to Date object
//           const datasetDate = new Date(dataset.timestamp);

//           // Check if datasetDate is within the start and end date range
//           const matchesStartDate = datasetDate >= start;
//           const matchesEndDate = datasetDate <= end;

//           return matchesStartDate && matchesEndDate;
//         });

//         // Enhance the data
//         const enhancedData = data.map((point, index) => {
//           let activities = [];

//           // Step 1: Exact match
//           const pointMinute = dayjs(point.createdAt).format("YYYY-MM-DD HH:mm");
//           const exactMatch = querySnapshot.find(
//             (fb) =>
//               dayjs(fb.timestamp).format("YYYY-MM-DD HH:mm") === pointMinute
//           );

//           if (exactMatch) {
//             console.log("Exact Match:", exactMatch.activities);
//             activities = exactMatch.activities || [];
//           } else {
//             // Step 2: Nearest Neighbor within ±1 minute (60000 ms)
//             let nearest = null;
//             let smallestDiff = Infinity;

//             querySnapshot.forEach((fb) => {
//               const fbTime = fb.timestamp;
//               const timeDiff = Math.abs(fbTime - point.createdAt);

//               if (timeDiff <= 60000 && timeDiff < smallestDiff) {
//                 smallestDiff = timeDiff;
//                 nearest = fb;
//               }
//             });

//             if (nearest) {
//               activities = nearest.activities || [];
//             }
//           }
//           return { ...point, activities };
//         });

//         setOriginalData(enhancedData);
//       } catch (error) {
//         console.error("Error fetching firebase data:", error);
//       }
//     };

//     if (!timeRange) {
//       fetchFirebaseData();
//     }
//   }, [data, timeRange]);

//   /** ──────── 🔁 Handlers ──────── */
//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
//     );
//   }, []);

//   const handleTimeRangeChange = (event) => {
//     const selected = event.target.value;
//     setTimeRange(selected);
//     console.log("startdates and end dates at 1 :-", startDate, endDate);

//     selected
//       ? fetchData(selected)
//       : setOriginalData(defaultOriginalData.current);
//   };

//   const fetchData = async (selectedRange) => {
//     setLoading(true);
//     try {
//       await console.log("startdates and end dates at 2 :-", startDate, endDate);

//       const response = await fetch(
//         "http://localhost:3500/api/node/filterByTimeRange",
//         // "http://52.250.54.24:3500/api/node/filterByTimeRange",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             timeRange: selectedRange,
//             nodeValue: NODE_ID,
//             startDate: startDate,
//             endDate: endDate,
//           }),
//         }
//       );
//       const result = await response.json();
//       console.log("Result:", result);

//       const formatted = result.data.map(({ activityData, createdAt }) => ({
//         timestamp: activityData.timestamp,
//         createdAt,
//         pm2_5: activityData.data?.pm2_5 || 0,
//         pm10: activityData.data?.pm10 || 0,
//         pm1: activityData.data?.pm1 || 0,
//         temperature: activityData.data?.temperature || 0,
//         humidity: activityData.data?.humidity || 0,
//         co: activityData.data?.co || 0,
//         voc: activityData.data?.voc || 0,
//         co2: activityData.data?.co2 || 0,
//         aqi_calc: Math.max(
//           activityData.calculated?.aqi_co || 0,
//           activityData.calculated?.aqi_dust || 0,
//           activityData.calculated?.aqi_co2 || 0,
//           activityData.calculated?.aqi_voc || 0
//         ),
//         aqi_pred: Math.max(
//           activityData.predicted?.aqi_co,
//           activityData.predicted?.aqi_dust
//         ),
//       }));

//       setOriginalData(formatted);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateCustomTicks = (data, selectedRange) => {
//     let interval;
//     if (selectedRange === "1h") interval = 10;
//     else if (selectedRange === "5h") interval = 30;
//     else if (selectedRange === "1d") interval = 60;

//     const seenMinutes = new Set();

//     return data
//       .filter((entry) => {
//         const ts = dayjs(entry.timestamp);
//         const minutes = ts.minute();
//         const hourMinuteKey = ts.format("HH:mm");

//         // Only include if it matches the interval and hasn't been added before
//         if (
//           (interval >= 60 ? minutes === 0 : minutes % interval === 0) &&
//           !seenMinutes.has(hourMinuteKey)
//         ) {
//           seenMinutes.add(hourMinuteKey);
//           return true;
//         }
//         return false;
//       })
//       .map((entry) => entry.timestamp);
//   };

//   const formatTooltipValue = useCallback(
//     (value, name, props) => {
//       const item = props.payload;
//       if (!item) return "N/A";
//       const match = originalData.find((d) => d.createdAt === item.createdAt);
//       const val = match?.[props.dataKey];
//       return val !== null && val !== undefined ? val.toFixed(2) : "N/A";
//     },
//     [originalData]
//   );

//   const CustomTooltip = ({ active, payload, label, originalData }) => {
//     if (!active || !payload || payload.length === 0) return null;

//     const scaledDataPoint = payload[0].payload;
//     const createdAt = scaledDataPoint.createdAt;

//     const originalPoint = originalData.find((d) => d.createdAt === createdAt);

//     const activities = originalPoint?.activities; // Skip ID + timestamp

//     return (
//       <Box
//         sx={{
//           backgroundColor: "#00796b",
//           padding: 2,
//           borderRadius: 2,
//           color: "#fff",
//           fontSize: 13,
//           maxWidth: 250,
//         }}
//       >
//         <div>
//           <strong>Time:</strong>{" "}
//           {dayjs(originalPoint?.timestamp || label).format(
//             "YYYY-MM-DD HH:mm:ss"
//           )}
//         </div>
//         {payload.map((entry) => {
//           const actualVal = originalPoint?.[entry.dataKey];
//           return (
//             <div key={entry.dataKey}>
//               <strong>{entry.name}:</strong>{" "}
//               {actualVal !== null && actualVal !== undefined
//                 ? actualVal.toFixed(2)
//                 : "N/A"}
//             </div>
//           );
//         })}
//         {activities && activities.length > 0 && (
//           <Box mt={1}>
//             <strong>Activities:</strong> {activities.join(", ")}
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   const ActivityDot = (props) => {
//     const { cx, cy, payload } = props;

//     // Check if this point has activities
//     const hasActivities = payload.activities && payload.activities.length > 0;

//     if (!hasActivities) return null;

//     return (
//       // <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 24 24">
//       <text x={cx + 5} y={cy - 5} textAnchor="middle" fontSize="16" fill="red">
//         🚩
//       </text>
//       // {/* </svg> */}
//     );
//   };

//   /** ──────── 📊 Data Processing ──────── */
//   const scaledData = useMemo(() => {
//     if (originalData.length === 0) return [];
//     const sorted = [...originalData].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );
//     const featureMinMax = selectedFeatures.reduce((acc, feature) => {
//       const values = sorted.map((item) => item[feature]);
//       acc[feature] = { min: Math.min(...values), max: Math.max(...values) };
//       return acc;
//     }, {});

//     return sorted.map((item) => {
//       const scaledItem = { ...item };
//       selectedFeatures.forEach((feature) => {
//         const { min, max } = featureMinMax[feature];
//         scaledItem[feature] =
//           min === max ? 0.5 : (item[feature] - min) / (max - min);
//       });
//       return scaledItem;
//     });
//   }, [originalData, selectedFeatures]);

//   const sortedOriginalData = useMemo(() => {
//     return [...originalData].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );
//   }, [originalData]);

//   const graphData = useMemo(() => {
//     return showActualData ? sortedOriginalData : scaledData;
//   }, [showActualData, scaledData, sortedOriginalData]);

//   /** ──────── 🧱 JSX Return ──────── */
//   return (
//     <Box sx={{ width: "98%", p: 1, textAlign: "center" }}>
//       {/* Title */}
//       <Typography
//         variant="h4"
//         sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
//       >
//         iPolluSense Dynamic Sensor Data Graph
//       </Typography>

//       {/* Feature Checkboxes */}
//       <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
//         {FEATURE_LIST.map((feature) => (
//           <FormControlLabel
//             key={feature.key}
//             control={
//               <Checkbox
//                 checked={selectedFeatures.includes(feature.key)}
//                 onChange={() => handleFeatureToggle(feature.key)}
//                 sx={{
//                   color: feature.color,
//                   "&.Mui-checked": { color: feature.color },
//                 }}
//               />
//             }
//             label={
//               <span style={{ color: feature.color, fontWeight: "bold" }}>
//                 {feature.label}
//               </span>
//             }
//             sx={{ mr: 2 }}
//           />
//         ))}
//       </FormGroup>

//       {/* Controls */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" }, // ← stack on small screens
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 2,
//           mb: 3,
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={() => setShowActualData((prev) => !prev)}
//           sx={{ height: 56, minWidth: { xs: "100%", sm: 200 } }} // full width on mobile
//         >
//           {showActualData ? "Show Scaled Data" : "Show Actual Data"}
//         </Button>
//         <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
//           <InputLabel id="time-range-label">Time Range</InputLabel>
//           <Select
//             labelId="time-range-label"
//             value={timeRange}
//             onChange={handleTimeRangeChange}
//             label="Time Range"
//           >
//             <MenuItem value="">Original Data</MenuItem>
//             <MenuItem value="1h">Last 1 Hour</MenuItem>
//             <MenuItem value="5h">Last 5 Hours</MenuItem>
//             <MenuItem value="1d">Last 1 Day</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Conditional Graph */}
//       {loading || data.length === 0 ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             p: 2,
//             borderRadius: 2,
//             boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//             backgroundColor: "aliceblue",
//           }}
//         >
//           <ResponsiveContainer width="100%" height={500}>
//             <LineChart
//               data={graphData}
//               margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
//             >
//               {/* Gradients */}
//               <defs>
//                 {FEATURE_LIST.map((feature) => (
//                   <linearGradient
//                     key={feature.key}
//                     id={feature.key}
//                     x1="0"
//                     y1="0"
//                     x2="0"
//                     y2="1"
//                   >
//                     <stop
//                       offset="5%"
//                       stopColor={feature.color}
//                       stopOpacity={0.8}
//                     />
//                     <stop
//                       offset="95%"
//                       stopColor={feature.color}
//                       stopOpacity={0.3}
//                     />
//                   </linearGradient>
//                 ))}
//               </defs>

//               {/* X-Axis */}
//               <XAxis
//                 dataKey="timestamp"
//                 angle={-45}
//                 textAnchor="end"
//                 tick={{ fill: "#555", fontWeight: "bold", fontSize: 11 }}
//                 interval={0}
//                 ticks={
//                   timeRange
//                     ? generateCustomTicks(graphData, timeRange)
//                     : undefined
//                 }
//                 tickFormatter={(tick) =>
//                   dayjs(tick).format("YYYY-MM-DD HH:mm:ss")
//                 }
//               />

//               {/* Y-Axis */}
//               <YAxis
//                 tick={{
//                   fill: "#555",
//                   fontWeight: "bold",
//                   fontSize: 11,
//                 }}
//                 domain={showActualData ? ["auto", "auto"] : [0, 1]}
//                 tickFormatter={(val) => val.toFixed(2)}
//               />

//               <CartesianGrid strokeDasharray="3 3" />
//               <Tooltip
//                 formatter={formatTooltipValue}
//                 contentStyle={{ backgroundColor: "#00796b", borderRadius: 5 }}
//                 itemStyle={{ fontWeight: "bold", color: "#fff" }}
//                 content={(props) => (
//                   <CustomTooltip {...props} originalData={originalData} />
//                 )}
//               />
//               <Legend
//                 wrapperStyle={{
//                   bottom: 5,
//                   fontWeight: "bold",
//                   color: "#555",
//                 }}
//               />

//               {/* Lines */}
//               {FEATURE_LIST.filter((f) => selectedFeatures.includes(f.key)).map(
//                 (feature) => (
//                   <Line
//                     key={feature.key}
//                     dataKey={feature.key}
//                     type="monotone"
//                     stroke={`url(#${feature.key})`}
//                     strokeWidth={3}
//                     // dot={{ r: 4 }}
//                     dot={<ActivityDot />} // 🟡 custom activity-aware dot
//                     activeDot={{ r: 6 }}
//                     name={feature.label}
//                   />
//                 )
//               )}
//             </LineChart>
//           </ResponsiveContainer>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GraphWithFeatureSelection;

import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import Activities from "./Activities";

// Component
const GraphWithFeatureSelection = ({ data, startDate, endDate }) => {
  /** ──────── 📦 Constants ──────── */
  const NODE_ID = 1192;

  const FEATURE_LIST = useMemo(
    () => [
      { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
      { key: "pm10", label: "PM10", color: "#079220" },
      { key: "pm1", label: "PM1", color: "#3357FF" },
      { key: "temperature", label: "Temperature", color: "#D4A302" },
      { key: "humidity", label: "Humidity", color: "#3C5D01" },
      { key: "co", label: "CO", color: "#C70039" },
      { key: "voc", label: "VOC", color: "#900C3F" },
      { key: "co2", label: "CO2", color: "#581845" },
      { key: "no2", label: "NO2", color: "#3E0174" },
      { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
      { key: "aqi_pred", label: "AQI (Predicted)", color: "#007979" },
    ],
    []
  );

  /** ──────── 📦 Firebase Configuration ──────── */
  // const firebaseConfig = {
  //   apiKey: "AIzaSyCSDU3MoCUfcC3Jfn_T-cZ6fqcp2ZUFFMk",
  //   authDomain: "ipollusense-52f67.firebaseapp.com",
  //   projectId: "ipollusense-52f67",
  //   storageBucket: "ipollusense-52f67.appspot.com",
  //   messagingSenderId: "733434038670",
  //   appId: "1:733434038670:web:7e3d9475fd6310d1afbcdf",
  //   measurementId: "G-VHSG19J7HN",
  // };
  const firebaseConfig = {
    apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
    authDomain: "ipollusense-annotate.firebaseapp.com",
    projectId: "ipollusense-annotate",
    storageBucket: "ipollusense-annotate.firebasestorage.app",
    messagingSenderId: "121648362000",
    appId: "1:121648362000:web:e242357f6470f0d4d89095",
  };

  /** ──────── 📦 Firebase Initialization ──────── */

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  /** ──────── 🧠 States ──────── */
  const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
  const [originalData, setOriginalData] = useState([]);
  const [showActualData, setShowActualData] = useState(false);
  const [timeRange, setTimeRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [showActivities, setShowActivities] = useState(false);

  const defaultOriginalData = useRef([]);

  /** ──────── 🎣 Effects ──────── */
  useEffect(() => {
    if (!timeRange) {
      defaultOriginalData.current = data;
      setOriginalData(data);
    }
  }, [data, timeRange]);

  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        // Convert startDate and endDate to Date objects for comparison
        const start = startDate
          ? new Date(startDate)
          : new Date(data[data.length - 1]?.createdAt);
        const end = endDate ? new Date(endDate) : new Date(data[0]?.createdAt);

        console.log("Start Date:", start, "End Date:", end);

        const checkpointsQuery = query(
          collection(db, "devices"),
          orderBy("timestamp", "desc")
        );
        let querySnapshot = await getDocs(checkpointsQuery);
        querySnapshot = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // console.log("querySnapshot:", querySnapshot);

        // Filter the querySnapshot based on date range
        querySnapshot = querySnapshot.filter((dataset) => {
          // Convert dataset.timestamp to Date object
          const datasetDate = new Date(dataset.timestamp);

          // Check if datasetDate is within the start and end date range
          const matchesStartDate = datasetDate >= start;
          const matchesEndDate = datasetDate <= end;

          return matchesStartDate && matchesEndDate;
        });

        // console.log("Filtered querySnapshot:", querySnapshot);

        // Enhance the data
        const enhancedData = data.map((point, index) => {
          let activities = [];

          // Step 1: Exact match
          const pointMinute = dayjs(point.createdAt).format("YYYY-MM-DD HH:mm");
          const exactMatch = querySnapshot.find(
            (fb) =>
              dayjs(fb.timestamp).format("YYYY-MM-DD HH:mm") === pointMinute
          );

          if (exactMatch) {
            console.log("Exact Match:", exactMatch.activities);
            activities = exactMatch.activities || [];
          } else {
            // console.log("entered else");

            // Step 2: Nearest Neighbor within ±1 minute (60000 ms)
            let nearest = null;
            let smallestDiff = Infinity;

            querySnapshot.forEach((fb) => {
              const fbTime = fb.timestamp;
              const timeDiff = Math.abs(fbTime - point.createdAt);

              if (timeDiff <= 60000 && timeDiff < smallestDiff) {
                smallestDiff = timeDiff;
                nearest = fb;
              }
            });

            if (nearest) {
              activities = nearest.activities || [];
            }
          }
          return { ...point, activities };
        });

        // console.log("Enhanced Data:", enhancedData);
        setOriginalData(enhancedData);
      } catch (error) {
        console.error("Error fetching firebase data:", error);
      }
    };

    if (!timeRange) {
      fetchFirebaseData();
    }
  }, [data, timeRange]);

  /** ──────── 🔁 Handlers ──────── */
  const handleFeatureToggle = useCallback((key) => {
    setSelectedFeatures((prev) =>
      prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
    );
  }, []);

  const handleTimeRangeChange = (event) => {
    const selected = event.target.value;
    setTimeRange(selected);
    console.log("startdates and end dates at 1 :-", startDate, endDate);

    selected
      ? fetchData(selected)
      : setOriginalData(defaultOriginalData.current);
  };

  const toggleActivities = () => {
    setShowActivities((prev) => !prev);
  };

  const fetchData = async (selectedRange) => {
    setLoading(true);
    try {
      console.log("startdates and end dates at 2 :-", startDate, endDate);

      // const response = await fetch(
      //   "http://localhost:3500/api/node/filterByTimeRange",
      //   // "http://52.250.54.24:3500/api/node/filterByTimeRange",
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       timeRange: selectedRange,
      //       nodeValue: NODE_ID,
      //       startDate: startDate,
      //       endDate: endDate,
      //     }),
      //   }
      // );

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

      const formattedStartDate = startDate ? formatDateTime(startDate) : null;
      const formattedEndDate = endDate ? formatDateTime(endDate) : null;

      const response = await fetch(
        "http://localhost:3500/api/node/filterByTimeRange",
        // "http://52.250.54.24:3500/api/node/filterByTimeRange",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            timeRange: selectedRange,
            nodeValue: NODE_ID,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          }),
        }
      );
      const result = await response.json();
      console.log("Result:", result);

      const formatted = result.data.map(({ activityData, createdAt }) => ({
        timestamp: activityData.timestamp,
        createdAt,
        pm2_5: activityData.data?.pm2_5 || 0,
        pm10: activityData.data?.pm10 || 0,
        pm1: activityData.data?.pm1 || 0,
        temperature: activityData.data?.temperature || 0,
        humidity: activityData.data?.humidity || 0,
        co: activityData.data?.co || 0,
        voc: activityData.data?.voc || 0,
        co2: activityData.data?.co2 || 0,
        aqi_calc: Math.max(
          activityData.calculated?.aqi_co || 0,
          activityData.calculated?.aqi_dust || 0,
          activityData.calculated?.aqi_co2 || 0,
          activityData.calculated?.aqi_voc || 0
        ),
        aqi_pred: Math.max(
          activityData.predicted?.aqi_co,
          activityData.predicted?.aqi_dust
        ),
      }));

      setOriginalData(formatted);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const generateCustomTicks = (data, selectedRange) => {
    let interval;
    if (selectedRange === "1h") interval = 10;
    else if (selectedRange === "5h") interval = 30;
    else if (selectedRange === "1d") interval = 60;

    const seenMinutes = new Set();

    return data
      .filter((entry) => {
        const ts = dayjs(entry.timestamp);
        const minutes = ts.minute();
        const hourMinuteKey = ts.format("HH:mm");

        // Only include if it matches the interval and hasn't been added before
        if (
          (interval >= 60 ? minutes === 0 : minutes % interval === 0) &&
          !seenMinutes.has(hourMinuteKey)
        ) {
          seenMinutes.add(hourMinuteKey);
          return true;
        }
        return false;
      })
      .map((entry) => entry.timestamp);
  };

  const formatTooltipValue = useCallback(
    (value, name, props) => {
      const item = props.payload;
      if (!item) return "N/A";
      const match = originalData.find((d) => d.createdAt === item.createdAt);
      const val = match?.[props.dataKey];
      return val !== null && val !== undefined ? val.toFixed(2) : "N/A";
    },
    [originalData]
  );

  const CustomTooltip = ({ active, payload, label, originalData }) => {
    if (!active || !payload || payload.length === 0) return null;

    const scaledDataPoint = payload[0].payload;
    const createdAt = scaledDataPoint.createdAt;

    const originalPoint = originalData.find((d) => d.createdAt === createdAt);

    const activities = originalPoint?.activities; // Skip ID + timestamp

    return (
      <Box
        sx={{
          backgroundColor: "#00796b",
          padding: 2,
          borderRadius: 2,
          color: "#fff",
          fontSize: 13,
          maxWidth: 250,
        }}
      >
        <div>
          <strong>Time:</strong>{" "}
          {dayjs(originalPoint?.timestamp || label).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
        </div>
        {payload.map((entry) => {
          const actualVal = originalPoint?.[entry.dataKey];
          return (
            <div key={entry.dataKey}>
              <strong>{entry.name}:</strong>{" "}
              {actualVal !== null && actualVal !== undefined
                ? actualVal.toFixed(2)
                : "N/A"}
            </div>
          );
        })}
        {activities && activities.length > 0 && (
          <Box mt={1}>
            <strong>Activities:</strong> {activities.join(", ")}
          </Box>
        )}
      </Box>
    );
  };

  const ActivityDot = (props) => {
    const { cx, cy, payload } = props;

    // Check if this point has activities
    const hasActivities = payload.activities && payload.activities.length > 0;

    if (!hasActivities) return null;

    return (
      // <svg x={cx - 6} y={cy - 6} width={12} height={12} viewBox="0 0 24 24">
      <text x={cx + 5} y={cy - 5} textAnchor="middle" fontSize="16" fill="red">
        🚩
      </text>
      // {/* </svg> */}
    );
  };

  /** ──────── 📊 Data Processing ──────── */
  const scaledData = useMemo(() => {
    if (originalData.length === 0) return [];
    const sorted = [...originalData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
    const featureMinMax = selectedFeatures.reduce((acc, feature) => {
      const values = sorted.map((item) => item[feature]);
      acc[feature] = { min: Math.min(...values), max: Math.max(...values) };
      return acc;
    }, {});

    return sorted.map((item) => {
      const scaledItem = { ...item };
      selectedFeatures.forEach((feature) => {
        const { min, max } = featureMinMax[feature];
        scaledItem[feature] =
          min === max ? 0.5 : (item[feature] - min) / (max - min);
      });
      return scaledItem;
    });
  }, [originalData, selectedFeatures]);

  const sortedOriginalData = useMemo(() => {
    return [...originalData].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [originalData, selectedFeatures]);

  const graphData = useMemo(() => {
    return showActualData ? sortedOriginalData : scaledData;
  }, [showActualData, scaledData, sortedOriginalData]);

  /** ──────── 🧱 JSX Return ──────── */
  return (
    <Box sx={{ width: "98%", p: 1, textAlign: "center" }}>
      {/* Title */}
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
      >
        iPolluSense Dynamic Sensor Data Graph
      </Typography>

      {/* Feature Checkboxes */}
      <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
        {FEATURE_LIST.map((feature) => (
          <FormControlLabel
            key={feature.key}
            control={
              <Checkbox
                checked={selectedFeatures.includes(feature.key)}
                onChange={() => handleFeatureToggle(feature.key)}
                sx={{
                  color: feature.color,
                  "&.Mui-checked": { color: feature.color },
                }}
              />
            }
            label={
              <span style={{ color: feature.color, fontWeight: "bold" }}>
                {feature.label}
              </span>
            }
            sx={{ mr: 2 }}
          />
        ))}
      </FormGroup>

      {/* Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // ← stack on small screens
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 3,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setShowActualData((prev) => !prev)}
          sx={{ height: 56, minWidth: { xs: "100%", sm: 100 } }} // full width on mobile
        >
          {showActualData ? "Show Scaled Data" : "Show Actual Data"}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={toggleActivities}
          sx={{ height: 56, minWidth: { xs: "100%", sm: 200 } }}
        >
          {showActivities ? "Hide Activities" : "Activities"}
        </Button>
        <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
          <InputLabel id="time-range-label">Time Range</InputLabel>
          <Select
            labelId="time-range-label"
            value={timeRange}
            onChange={handleTimeRangeChange}
            label="Time Range"
          >
            <MenuItem value="">Original Data</MenuItem>
            <MenuItem value="1h">Last 1 Hour</MenuItem>
            <MenuItem value="5h">Last 5 Hours</MenuItem>
            <MenuItem value="1d">Last 1 Day</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Conditional Graph */}
      {loading || data.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            gap: 2,
            borderRadius: 2,
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            backgroundColor: "aliceblue",
          }}
        >
          <Box sx={{ flex: showActivities ? 2 : 3 }}>
            <ResponsiveContainer width="100%" height={500}>
              <LineChart
                data={graphData}
                margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
              >
                {/* Gradients */}
                <defs>
                  {FEATURE_LIST.map((feature) => (
                    <linearGradient
                      key={feature.key}
                      id={feature.key}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={feature.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={feature.color}
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  ))}
                </defs>

                {/* X-Axis */}
                <XAxis
                  dataKey="timestamp"
                  angle={-45}
                  textAnchor="end"
                  tick={{ fill: "#555", fontWeight: "bold", fontSize: 11 }}
                  interval={0}
                  ticks={
                    timeRange
                      ? generateCustomTicks(graphData, timeRange)
                      : undefined
                  }
                  tickFormatter={(tick) =>
                    dayjs(tick).format("YYYY-MM-DD HH:mm:ss")
                  }
                />

                {/* Y-Axis */}
                <YAxis
                  tick={{
                    fill: "#555",
                    fontWeight: "bold",
                    fontSize: 11,
                  }}
                  domain={showActualData ? ["auto", "auto"] : [0, 1]}
                  tickFormatter={(val) => val.toFixed(2)}
                />

                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip
                  formatter={formatTooltipValue}
                  contentStyle={{ backgroundColor: "#00796b", borderRadius: 5 }}
                  itemStyle={{ fontWeight: "bold", color: "#fff" }}
                  content={(props) => (
                    <CustomTooltip {...props} originalData={originalData} />
                  )}
                />
                <Legend
                  wrapperStyle={{
                    bottom: 5,
                    fontWeight: "bold",
                    color: "#555",
                  }}
                />

                {/* Lines */}
                {FEATURE_LIST.filter((f) =>
                  selectedFeatures.includes(f.key)
                ).map((feature) => (
                  <Line
                    key={feature.key}
                    dataKey={feature.key}
                    type="monotone"
                    stroke={`url(#${feature.key})`}
                    strokeWidth={3}
                    // dot={{ r: 4 }}
                    dot={<ActivityDot />} // 🟡 custom activity-aware dot
                    activeDot={{ r: 6 }}
                    name={feature.label}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </Box>
          {showActivities && (
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                <Activities
                  data={data}
                  startDate={startDate}
                  endDate={endDate}
                />
              </Typography>
              {/* Add your SensorDataCards or other        components here */}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default GraphWithFeatureSelection;

// import React, {
//   useState,
//   useMemo,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";
// import {
//   Typography,
//   Box,
//   Checkbox,
//   FormControlLabel,
//   FormGroup,
//   Button,
//   MenuItem,
//   Select,
//   InputLabel,
//   FormControl,
//   CircularProgress,
// } from "@mui/material";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";
// import dayjs from "dayjs";
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getDocs,
//   orderBy,
// } from "firebase/firestore";

// // Component
// const GraphWithFeatureSelection = ({ data, startDate, endDate }) => {
//   /** ──────── 📦 Constants ──────── */
//   const NODE_ID = 1192;

//   const FEATURE_LIST = useMemo(
//     () => [
//       { key: "pm2_5", label: "PM2.5", color: "#FF5733" },
//       { key: "pm10", label: "PM10", color: "#079220" },
//       { key: "pm1", label: "PM1", color: "#3357FF" },
//       { key: "temperature", label: "Temperature", color: "#D4A302" },
//       { key: "humidity", label: "Humidity", color: "#3C5D01" },
//       { key: "co", label: "CO", color: "#C70039" },
//       { key: "voc", label: "VOC", color: "#900C3F" },
//       { key: "co2", label: "CO2", color: "#581845" },
//       { key: "no2", label: "NO2", color: "#3E0174" },
//       { key: "aqi_calc", label: "AQI (Calculated)", color: "#FF33FF" },
//       { key: "aqi_pred", label: "AQI (Predicted)", color: "#007979" },
//     ],
//     []
//   );

//   /** ──────── 📦 Firebase Configuration ──────── */
//   const firebaseConfig = {
//     apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
//     authDomain: "ipollusense-annotate.firebaseapp.com",
//     projectId: "ipollusense-annotate",
//     storageBucket: "ipollusense-annotate.firebasestorage.app",
//     messagingSenderId: "121648362000",
//     appId: "1:121648362000:web:e242357f6470f0d4d89095",
//   };

//   /** ──────── 📦 Firebase Initialization ──────── */

//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   /** ──────── 🧠 States ──────── */
//   const [selectedFeatures, setSelectedFeatures] = useState(["pm2_5", "pm10"]);
//   const [originalData, setOriginalData] = useState([]);
//   const [showActualData, setShowActualData] = useState(false);
//   const [timeRange, setTimeRange] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showActivities, setShowActivities] = useState(false);
//   const defaultOriginalData = useRef([]);

//   /** ──────── 🎣 Effects ──────── */
//   useEffect(() => {
//     if (!timeRange) {
//       defaultOriginalData.current = data;
//       setOriginalData(data);
//     }
//   }, [data, timeRange]);

//   useEffect(() => {
//     const fetchFirebaseData = async () => {
//       try {
//         // Convert startDate and endDate to Date objects for comparison
//         const start = startDate
//           ? new Date(startDate)
//           : new Date(data[data.length - 1]?.createdAt);
//         const end = endDate ? new Date(endDate) : new Date(data[0]?.createdAt);

//         const checkpointsQuery = query(
//           collection(db, "devices"),
//           orderBy("timestamp", "desc")
//         );
//         let querySnapshot = await getDocs(checkpointsQuery);
//         querySnapshot = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));

//         // Filter the querySnapshot based on date range
//         querySnapshot = querySnapshot.filter((dataset) => {
//           // Convert dataset.timestamp to Date object
//           const datasetDate = new Date(dataset.timestamp);

//           // Check if datasetDate is within the start and end date range
//           const matchesStartDate = datasetDate >= start;
//           const matchesEndDate = datasetDate <= end;

//           return matchesStartDate && matchesEndDate;
//         });

//         // Enhance the data
//         const enhancedData = data.map((point, index) => {
//           let activities = [];

//           // Step 1: Exact match
//           const pointMinute = dayjs(point.createdAt).format("YYYY-MM-DD HH:mm");
//           const exactMatch = querySnapshot.find(
//             (fb) =>
//               dayjs(fb.timestamp).format("YYYY-MM-DD HH:mm") === pointMinute
//           );

//           if (exactMatch) {
//             activities = exactMatch.activities || [];
//           } else {
//             // Step 2: Nearest Neighbor within ±1 minute (60000 ms)
//             let nearest = null;
//             let smallestDiff = Infinity;

//             querySnapshot.forEach((fb) => {
//               const fbTime = fb.timestamp;
//               const timeDiff = Math.abs(fbTime - point.createdAt);

//               if (timeDiff <= 60000 && timeDiff < smallestDiff) {
//                 smallestDiff = timeDiff;
//                 nearest = fb;
//               }
//             });

//             if (nearest) {
//               activities = nearest.activities || [];
//             }
//           }
//           return { ...point, activities };
//         });

//         setOriginalData(enhancedData);
//       } catch (error) {
//         console.error("Error fetching firebase data:", error);
//       }
//     };

//     if (!timeRange) {
//       fetchFirebaseData();
//     }
//   }, [data, timeRange]);

//   /** ──────── 🔁 Handlers ──────── */
//   const handleFeatureToggle = useCallback((key) => {
//     setSelectedFeatures((prev) =>
//       prev.includes(key) ? prev.filter((f) => f !== key) : [...prev, key]
//     );
//   }, []);

//   const handleTimeRangeChange = (event) => {
//     const selected = event.target.value;
//     setTimeRange(selected);

//     selected
//       ? fetchData(selected)
//       : setOriginalData(defaultOriginalData.current);
//   };

//   const toggleActivities = () => {
//     setShowActivities((prev) => !prev);
//   };

//   const fetchData = async (selectedRange) => {
//     setLoading(true);
//     try {
//       const formatDateTime = (dateTime) => {
//         const date = new Date(dateTime);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, "0");
//         const day = String(date.getDate()).padStart(2, "0");
//         const hours = String(date.getHours()).padStart(2, "0");
//         const minutes = String(date.getMinutes()).padStart(2, "0");
//         const seconds = "00";
//         return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
//       };

//       const formattedStartDate = startDate ? formatDateTime(startDate) : null;
//       const formattedEndDate = endDate ? formatDateTime(endDate) : null;

//       const response = await fetch(
//         "http://localhost:3500/api/node/filterByTimeRange",
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             timeRange: selectedRange,
//             nodeValue: NODE_ID,
//             startDate: formattedStartDate,
//             endDate: formattedEndDate,
//           }),
//         }
//       );
//       const result = await response.json();

//       const formatted = result.data.map(({ activityData, createdAt }) => ({
//         timestamp: activityData.timestamp,
//         createdAt,
//         pm2_5: activityData.data?.pm2_5 || 0,
//         pm10: activityData.data?.pm10 || 0,
//         pm1: activityData.data?.pm1 || 0,
//         temperature: activityData.data?.temperature || 0,
//         humidity: activityData.data?.humidity || 0,
//         co: activityData.data?.co || 0,
//         voc: activityData.data?.voc || 0,
//         co2: activityData.data?.co2 || 0,
//         aqi_calc: Math.max(
//           activityData.calculated?.aqi_co || 0,
//           activityData.calculated?.aqi_dust || 0,
//           activityData.calculated?.aqi_co2 || 0,
//           activityData.calculated?.aqi_voc || 0
//         ),
//         aqi_pred: Math.max(
//           activityData.predicted?.aqi_co,
//           activityData.predicted?.aqi_dust
//         ),
//       }));

//       setOriginalData(formatted);
//     } catch (err) {
//       console.error("Fetch Error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateCustomTicks = (data, selectedRange) => {
//     let interval;
//     if (selectedRange === "1h") interval = 10;
//     else if (selectedRange === "5h") interval = 30;
//     else if (selectedRange === "1d") interval = 60;

//     const seenMinutes = new Set();

//     return data
//       .filter((entry) => {
//         const ts = dayjs(entry.timestamp);
//         const minutes = ts.minute();
//         const hourMinuteKey = ts.format("HH:mm");

//         // Only include if it matches the interval and hasn't been added before
//         if (
//           (interval >= 60 ? minutes === 0 : minutes % interval === 0) &&
//           !seenMinutes.has(hourMinuteKey)
//         ) {
//           seenMinutes.add(hourMinuteKey);
//           return true;
//         }
//         return false;
//       })
//       .map((entry) => entry.timestamp);
//   };

//   const formatTooltipValue = useCallback(
//     (value, name, props) => {
//       const item = props.payload;
//       if (!item) return "N/A";
//       const match = originalData.find((d) => d.createdAt === item.createdAt);
//       const val = match?.[props.dataKey];
//       return val !== null && val !== undefined ? val.toFixed(2) : "N/A";
//     },
//     [originalData]
//   );

//   const CustomTooltip = ({ active, payload, label, originalData }) => {
//     if (!active || !payload || payload.length === 0) return null;

//     const scaledDataPoint = payload[0].payload;
//     const createdAt = scaledDataPoint.createdAt;

//     const originalPoint = originalData.find((d) => d.createdAt === createdAt);

//     const activities = originalPoint?.activities; // Skip ID + timestamp

//     return (
//       <Box
//         sx={{
//           backgroundColor: "#00796b",
//           padding: 2,
//           borderRadius: 2,
//           color: "#fff",
//           fontSize: 13,
//           maxWidth: 250,
//         }}
//       >
//         <div>
//           <strong>Time:</strong>{" "}
//           {dayjs(originalPoint?.timestamp || label).format(
//             "YYYY-MM-DD HH:mm:ss"
//           )}
//         </div>
//         {payload.map((entry) => {
//           const actualVal = originalPoint?.[entry.dataKey];
//           return (
//             <div key={entry.dataKey}>
//               <strong>{entry.name}:</strong>{" "}
//               {actualVal !== null && actualVal !== undefined
//                 ? actualVal.toFixed(2)
//                 : "N/A"}
//             </div>
//           );
//         })}
//         {activities && activities.length > 0 && (
//           <Box mt={1}>
//             <strong>Activities:</strong> {activities.join(", ")}
//           </Box>
//         )}
//       </Box>
//     );
//   };

//   const ActivityDot = (props) => {
//     const { cx, cy, payload } = props;

//     // Check if this point has activities
//     const hasActivities = payload.activities && payload.activities.length > 0;

//     if (!hasActivities) return null;

//     return (
//       <text x={cx + 5} y={cy - 5} textAnchor="middle" fontSize="16" fill="red">
//         🚩
//       </text>
//     );
//   };

//   /** ──────── 📊 Data Processing ──────── */
//   const scaledData = useMemo(() => {
//     if (originalData.length === 0) return [];
//     const sorted = [...originalData].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );
//     const featureMinMax = selectedFeatures.reduce((acc, feature) => {
//       const values = sorted.map((item) => item[feature]);
//       acc[feature] = { min: Math.min(...values), max: Math.max(...values) };
//       return acc;
//     }, {});

//     return sorted.map((item) => {
//       const scaledItem = { ...item };
//       selectedFeatures.forEach((feature) => {
//         const { min, max } = featureMinMax[feature];
//         scaledItem[feature] =
//           min === max ? 0.5 : (item[feature] - min) / (max - min);
//       });
//       return scaledItem;
//     });
//   }, [originalData, selectedFeatures]);

//   const sortedOriginalData = useMemo(() => {
//     return [...originalData].sort(
//       (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//     );
//   }, [originalData]);

//   const graphData = useMemo(() => {
//     return showActualData ? sortedOriginalData : scaledData;
//   }, [showActualData, scaledData, sortedOriginalData]);

//   /** ──────── 🧱 JSX Return ──────── */
//   return (
//     <Box sx={{ width: "98%", p: 1, textAlign: "center" }}>
//       {/* Title */}
//       <Typography
//         variant="h4"
//         sx={{ fontWeight: "bold", color: "#1976d2", mb: 3 }}
//       >
//         iPolluSense Dynamic Sensor Data Graph
//       </Typography>

//       {/* Feature Checkboxes */}
//       <FormGroup row sx={{ justifyContent: "center", mb: 3 }}>
//         {FEATURE_LIST.map((feature) => (
//           <FormControlLabel
//             key={feature.key}
//             control={
//               <Checkbox
//                 checked={selectedFeatures.includes(feature.key)}
//                 onChange={() => handleFeatureToggle(feature.key)}
//                 sx={{
//                   color: feature.color,
//                   "&.Mui-checked": { color: feature.color },
//                 }}
//               />
//             }
//             label={
//               <span style={{ color: feature.color, fontWeight: "bold" }}>
//                 {feature.label}
//               </span>
//             }
//             sx={{ mr: 2 }}
//           />
//         ))}
//       </FormGroup>

//       {/* Controls */}
//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: { xs: "column", sm: "row" },
//           justifyContent: "space-between",
//           alignItems: "center",
//           gap: 2,
//           mb: 3,
//         }}
//       >
//         <Button
//           variant="contained"
//           onClick={() => setShowActualData((prev) => !prev)}
//           sx={{ height: 56, minWidth: { xs: "100%", sm: 200 } }}
//         >
//           {showActualData ? "Show Scaled Data" : "Show Actual Data"}
//         </Button>
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={toggleActivities}
//           sx={{ height: 56, minWidth: { xs: "100%", sm: 200 } }}
//         >
//           {showActivities ? "Show Full Graph" : "Activities"}
//         </Button>
//         <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
//           <InputLabel id="time-range-label">Time Range</InputLabel>
//           <Select
//             labelId="time-range-label"
//             value={timeRange}
//             onChange={handleTimeRangeChange}
//             label="Time Range"
//           >
//             <MenuItem value="">Original Data</MenuItem>
//             <MenuItem value="1h">Last 1 Hour</MenuItem>
//             <MenuItem value="5h">Last 5 Hours</MenuItem>
//             <MenuItem value="1d">Last 1 Day</MenuItem>
//           </Select>
//         </FormControl>
//       </Box>

//       {/* Conditional Graph and Activities */}
//       {loading || data.length === 0 ? (
//         <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "row",
//             justifyContent: "space-between",
//             gap: 2,
//             borderRadius: 2,
//             boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
//             backgroundColor: "aliceblue",
//           }}
//         >
//           <Box sx={{ flex: showActivities ? 2 : 3 }}>
//             <ResponsiveContainer width="100%" height={500}>
//               <LineChart
//                 data={graphData}
//                 margin={{ top: 20, right: 40, left: 20, bottom: 90 }}
//               >
//                 {/* Gradients */}
//                 <defs>
//                   {FEATURE_LIST.map((feature) => (
//                     <linearGradient
//                       key={feature.key}
//                       id={feature.key}
//                       x1="0"
//                       y1="0"
//                       x2="0"
//                       y2="1"
//                     >
//                       <stop
//                         offset="5%"
//                         stopColor={feature.color}
//                         stopOpacity={0.8}
//                       />
//                       <stop
//                         offset="95%"
//                         stopColor={feature.color}
//                         stopOpacity={0.3}
//                       />
//                     </linearGradient>
//                   ))}
//                 </defs>

//                 {/* X-Axis */}
//                 <XAxis
//                   dataKey="timestamp"
//                   angle={-45}
//                   textAnchor="end"
//                   tick={{ fill: "#555", fontWeight: "bold", fontSize: 11 }}
//                   interval={0}
//                   ticks={
//                     timeRange
//                       ? generateCustomTicks(graphData, timeRange)
//                       : undefined
//                   }
//                   tickFormatter={(tick) =>
//                     dayjs(tick).format("YYYY-MM-DD HH:mm:ss")
//                   }
//                 />

//                 {/* Y-Axis */}
//                 <YAxis
//                   tick={{
//                     fill: "#555",
//                     fontWeight: "bold",
//                     fontSize: 11,
//                   }}
//                   domain={showActualData ? ["auto", "auto"] : [0, 1]}
//                   tickFormatter={(val) => val.toFixed(2)}
//                 />

//                 <CartesianGrid strokeDasharray="3 3" />
//                 <Tooltip
//                   formatter={formatTooltipValue}
//                   contentStyle={{
//                     backgroundColor: "#00796b",
//                     borderRadius: 5,
//                   }}
//                   itemStyle={{ fontWeight: "bold", color: "#fff" }}
//                   content={(props) => (
//                     <CustomTooltip {...props} originalData={originalData} />
//                   )}
//                 />
//                 <Legend
//                   wrapperStyle={{
//                     bottom: 5,
//                     fontWeight: "bold",
//                     color: "#555",
//                   }}
//                 />

//                 {/* Lines */}
//                 {FEATURE_LIST.filter((f) =>
//                   selectedFeatures.includes(f.key)
//                 ).map((feature) => (
//                   <Line
//                     key={feature.key}
//                     dataKey={feature.key}
//                     type="monotone"
//                     stroke={`url(#${feature.key})`}
//                     strokeWidth={3}
//                     dot={<ActivityDot />}
//                     activeDot={{ r: 6 }}
//                     name={feature.label}
//                   />
//                 ))}
//               </LineChart>
//             </ResponsiveContainer>
//           </Box>
//           {showActivities && (
//             <Box sx={{ flex: 1 }}>
//               <Typography variant="h6" sx={{ mb: 2 }}>
//                 Activities
//               </Typography>
//               {/* Add your SensorDataCards or other components here */}
//             </Box>
//           )}
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default GraphWithFeatureSelection;
