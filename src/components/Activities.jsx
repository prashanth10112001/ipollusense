// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import {
//   getFirestore,
//   collection,
//   getDocs,
//   query,
//   orderBy,
// } from "firebase/firestore";

// function Activities({ data, startDate, endDate }) {
//   const firebaseConfig = {
//     apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
//     authDomain: "ipollusense-annotate.firebaseapp.com",
//     projectId: "ipollusense-annotate",
//     storageBucket: "ipollusense-annotate.firebasestorage.app",
//     messagingSenderId: "121648362000",
//     appId: "1:121648362000:web:e242357f6470f0d4d89095",
//   };

//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   const [activities, setActivities] = useState([]);

//   const fetchActivities = async () => {
//     try {
//       const start = startDate
//         ? new Date(startDate)
//         : new Date(data[data.length - 1]?.createdAt);
//       const end = endDate ? new Date(endDate) : new Date(data[0]?.createdAt);

//       console.log("Start Date:", start, "End Date:", end);

//       const checkpointsQuery = query(
//         collection(db, "devices"),
//         orderBy("timestamp", "desc")
//       );
//       let querySnapshot = await getDocs(checkpointsQuery);
//       querySnapshot = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       //   const fetchedActivities = querySnapshot.docs.map((doc) => ({
//       //     id: doc.id,
//       //     ...doc.data(),
//       //   }));
//       console.log("fetchedActivities", querySnapshot);

//       setActivities(querySnapshot);
//     } catch (error) {
//       console.error("Error fetching activities: ", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={fetchActivities}>Fetch Activities</button>
//       <ul>
//         {activities.map((activity, index) => (
//           <li key={index}>{JSON.stringify(activity)}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Activities;

// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import { Box, Typography, List, ListItem, ListItemText } from "@mui/material";

// function Activities() {
//   const firebaseConfig = {
//     apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
//     authDomain: "ipollusense-annotate.firebaseapp.com",
//     projectId: "ipollusense-annotate",
//     storageBucket: "ipollusense-annotate.firebasestorage.app",
//     messagingSenderId: "121648362000",
//     appId: "1:121648362000:web:e242357f6470f0d4d89095",
//   };

//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   const [activities, setActivities] = useState([]);

//   const fetchActivities = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "devices"));
//       console.log("querySnapshot:", querySnapshot);

//       const fetchedActivities = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       console.log("filteredActivities", fetchedActivities);

//       setActivities(fetchedActivities);
//     } catch (error) {
//       console.error("Error fetching activities: ", error);
//     }
//   };

//   return (
//     <Box sx={{ padding: 2, maxWidth: 400, margin: "auto" }}>
//       <Typography
//         variant="h5"
//         sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
//       >
//         Activities
//       </Typography>
//       <Box
//         sx={{
//           maxHeight: 300,
//           overflowY: "auto",
//           border: "1px solid #ccc",
//           borderRadius: 2,
//           padding: 2,
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         <List>
//           {activities.map((activity, index) => (
//             <ListItem key={index} divider>
//               <ListItemText primary={activity.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//       <Box sx={{ textAlign: "center", marginTop: 2 }}>
//         <button
//           onClick={fetchActivities}
//           style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
//         >
//           Fetch Activities
//         </button>
//       </Box>
//     </Box>
//   );
// }

// export default Activities;

// import React, { useState } from "react";
// import { initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Dialog,
//   DialogTitle,
//   DialogContent,
// } from "@mui/material";

// function Activities() {
//   const firebaseConfig = {
//     apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
//     authDomain: "ipollusense-annotate.firebaseapp.com",
//     projectId: "ipollusense-annotate",
//     storageBucket: "ipollusense-annotate.firebasestorage.app",
//     messagingSenderId: "121648362000",
//     appId: "1:121648362000:web:e242357f6470f0d4d89095",
//   };

//   const app = initializeApp(firebaseConfig);
//   const db = getFirestore(app);

//   const [activities, setActivities] = useState([]);
//   const [selectedActivity, setSelectedActivity] = useState(null);

//   const fetchActivities = async () => {
//     try {
//       const querySnapshot = await getDocs(collection(db, "devices"));
//       const fetchedActivities = querySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setActivities(fetchedActivities);
//     } catch (error) {
//       console.error("Error fetching activities: ", error);
//     }
//   };

//   const handleActivityClick = (activity) => {
//     setSelectedActivity(activity);
//   };

//   const handleCloseDialog = () => {
//     setSelectedActivity(null);
//   };

//   return (
//     <Box sx={{ padding: 2, maxWidth: 400, margin: "auto" }}>
//       <Typography
//         variant="h5"
//         sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
//       >
//         Activities
//       </Typography>
//       <Box
//         sx={{
//           maxHeight: 300,
//           overflowY: "auto",
//           border: "1px solid #ccc",
//           borderRadius: 2,
//           padding: 2,
//           backgroundColor: "#f9f9f9",
//         }}
//       >
//         <List>
//           {activities.map((activity, index) => (
//             <ListItem
//               key={index}
//               divider
//               button={true}
//               onClick={() => handleActivityClick(activity)}
//             >
//               <ListItemText primary={activity.name} />
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//       <Box sx={{ textAlign: "center", marginTop: 2 }}>
//         <button
//           onClick={fetchActivities}
//           style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
//         >
//           Fetch Activities
//         </button>
//       </Box>

//       {selectedActivity && (
//         <Dialog open={true} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
//           <DialogTitle>Activity Details</DialogTitle>
//           <DialogContent>
//             <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Name:</strong> {selectedActivity.name}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Timestamp:</strong> {selectedActivity.timestamp}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Activities:</strong>{" "}
//                 {selectedActivity.activities?.join(", ") || "N/A"}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Conditions:</strong>{" "}
//                 {selectedActivity.conditions?.join(", ") || "N/A"}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Device IDs:</strong>{" "}
//                 {selectedActivity.device_ids?.join(", ") || "N/A"}
//               </Typography>
//               <Typography variant="body1" gutterBottom>
//                 <strong>Factors:</strong>
//               </Typography>
//               <ul>
//                 {selectedActivity.factors?.map((factor, idx) => (
//                   <li key={idx}>
//                     {factor.key}: {factor.value}
//                   </li>
//                 )) || "N/A"}
//               </ul>
//               <Typography variant="body1" gutterBottom>
//                 <strong>ID:</strong> {selectedActivity.id}
//               </Typography>
//             </Box>
//           </DialogContent>
//         </Dialog>
//       )}
//     </Box>
//   );
// }

// export default Activities;

import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function Activities() {
  const firebaseConfig = {
    apiKey: "AIzaSyB1xTPugTDvvOSkDabJ0igx00Y0_ug_oeY",
    authDomain: "ipollusense-annotate.firebaseapp.com",
    projectId: "ipollusense-annotate",
    storageBucket: "ipollusense-annotate.firebasestorage.app",
    messagingSenderId: "121648362000",
    appId: "1:121648362000:web:e242357f6470f0d4d89095",
  };

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "devices"));
      const fetchedActivities = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("fetchedActivities", fetchedActivities);

      setActivities(fetchedActivities);
    } catch (error) {
      console.error("Error fetching activities: ", error);
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleCloseDialog = () => {
    setSelectedActivity(null);
  };

  return (
    <Box sx={{ padding: 2, maxWidth: 400, margin: "auto" }}>
      <Typography
        variant="h5"
        sx={{ textAlign: "center", marginBottom: 2, fontWeight: "bold" }}
      >
        Activities
      </Typography>
      <Box
        sx={{
          maxHeight: 300,
          overflowY: "auto",
          border: "1px solid #ccc",
          borderRadius: 2,
          //   padding: 2,
          backgroundColor: "#f9f9f9",
        }}
      >
        {activities.length === 0 ? (
          "No activities found"
        ) : (
          <List>
            {activities.map((activity, index) => (
              <ListItem
                key={index}
                divider
                component="div" // Explicitly set the component to avoid passing `button` to the DOM
                onClick={() => handleActivityClick(activity)}
                sx={{ cursor: "pointer" }} // Add cursor styling for better UX
              >
                <ListItemText
                  primary={activity.name}
                  secondary={new Date(activity.timestamp).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                  primaryTypographyProps={{
                    fontSize: "0.8rem", // Slightly larger font for the name
                    fontWeight: "bold", // Bold for emphasis
                  }}
                  secondaryTypographyProps={{
                    fontSize: "0.6rem", // Smaller font for the timestamp
                    color: "rgba(128, 128, 128, 0.7)", // Grey color with reduced opacity
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Box>
      <Box sx={{ textAlign: "center", marginTop: 2 }}>
        <button
          onClick={fetchActivities}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          Fetch Activities
        </button>
      </Box>

      {selectedActivity && (
        <Dialog open={true} onClose={handleCloseDialog} maxWidth="xs">
          <DialogTitle
            sx={{
              fontSize: "0.9rem",
              padding: "6px 12px",
              fontWeight: "bold",
            }}
          >
            Activity Details
          </DialogTitle>

          <DialogContent sx={{ padding: "8px 12px" }}>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {/* Activity fields */}
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>Name:</Box>
                <Box>{selectedActivity.name}</Box>
              </Box>
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>Timestamp:</Box>
                <Box>
                  {new Date(selectedActivity.timestamp).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </Box>
              </Box>
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>Activities:</Box>
                <Box>{selectedActivity.activities?.join(", ") || "N/A"}</Box>
              </Box>
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>Conditions:</Box>
                <Box>{selectedActivity.conditions?.join(", ") || "N/A"}</Box>
              </Box>
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>Device IDs:</Box>
                <Box>{selectedActivity.device_ids?.join(", ") || "N/A"}</Box>
              </Box>
              <Box sx={{ fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold" }}>Factors:</Box>
                <ul
                  style={{
                    paddingLeft: "1.2em",
                    marginTop: 4,
                    marginBottom: 6,
                  }}
                >
                  {selectedActivity.factors?.length > 0 ? (
                    selectedActivity.factors.map((factor, idx) => (
                      <li
                        key={idx}
                        style={{ fontSize: "0.75rem", lineHeight: 1.3 }}
                      >
                        {factor.key}: {factor.value}
                      </li>
                    ))
                  ) : (
                    <li style={{ fontSize: "0.75rem" }}>N/A</li>
                  )}
                </ul>
              </Box>
              <Box sx={{ display: "flex", fontSize: "0.8rem" }}>
                <Box sx={{ fontWeight: "bold", minWidth: 90 }}>ID:</Box>
                <Box>{selectedActivity.id}</Box>
              </Box>
            </Box>
          </DialogContent>

          {/* Close Button at Bottom Right */}
          {/* <DialogActions sx={{ padding: "8px 12px" }}>
            <Button onClick={handleCloseDialog} variant="outlined" size="small">
              Close
            </Button>
          </DialogActions> */}
          <DialogActions
            sx={{ padding: "8px 12px", justifyContent: "flex-end" }}
          >
            <Button
              onClick={handleCloseDialog}
              variant="contained"
              size="small"
              color="primary"
              //   startIcon={<CloseIcon />} // Make sure to import this
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

export default Activities;
