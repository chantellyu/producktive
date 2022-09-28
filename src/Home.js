import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useLocation, useNavigate } from "react-router-dom";
import "./Home.css";
import { auth, db, logout } from "./firebase";
import {
  query,
  collection,
  getDocs,
  getDoc,
  where,
  doc,
  setDoc,
} from "firebase/firestore";
import { styled, useTheme } from "@mui/material/styles";
import {
  Typography,
  TextField,
  Paper,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Drawer,
  CssBaseline,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Modal,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import NotesIcon from "@mui/icons-material/Notes";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { isDate } from "date-fns";

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: "5px",
  boxShadow: 24,
  p: 4,
};

function Mod({ openModal, closeModal, currentProjectId, currentProjectName }) {
  return (
    <div>
      <Modal open={openModal} onClose={closeModal}>
        <Box sx={style}>
          <Typography id="modaltitle" variant="h6" component="h2">
            Share Project
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Copy the code below and share it with others so they can add this
            project and collaborate with you.
          </Typography>
          <Typography color={"#422f1e"} mt={1}>
            Project Code for {currentProjectName}: {currentProjectId}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}

//below for deadlinebox
function getStatement(n) {
  if (n.length === 0) {
    return <p>Please select a deadline first.</p>;
  } else {
    return (
      <p>
        {" "}
        You have{" "}
        <strong>
          {n} day{n === 1 ? "" : "s"}
        </strong>{" "}
        left.
      </p>
    );
  }
}

function DeadlineBox({ projectId }) {
  const [message, setMessage] = useState("");
  const [value, setValue] = useState(null);
  //const [check, setCheck] = useState("");

  const fetchDate = async () => {
    try {
      const docRef = doc(db, "projects", projectId, "deadline", "date");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        handleChange(docSnap.data().deadline.toDate());
      }
      //setCheck(docSnap.data().text);
      //handleChange(docSnap.data().deadline.toDate());
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching date");
    }
  };

  useEffect(() => {
    fetchDate();
  });

  const handleChange = async (end) => {
    const date1 = new Date();
    const date2 = new Date(end);
    const diffInTime = date2.getTime() - date1.getTime();
    const diffInDays = Math.ceil(diffInTime / (1000 * 3600 * 24));
    if (isDate(end) && diffInDays >= 0) {
      setValue(end);
      setMessage(diffInDays);

      try {
        const dateRef = doc(db, "projects", projectId, "deadline", "date");
        await setDoc(
          dateRef,
          {
            deadline: end,
          },
          { merge: true }
        );
      } catch (error) {
        console.log(error);
        alert("Date could not be updated.");
      }
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "center",
        alignItems: "center",
        backgroundColor: "white",
        padding: "35px",
      }}
    >
      <h2>Countdown</h2>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Select project deadline"
          inputFormat="dd/MM/yyyy"
          disablePast
          value={value}
          onChange={(newValue) => {
            handleChange(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
      <div>{getStatement(message)}</div>
    </Paper>
  );
}

function Home() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const showModal = () => setOpenModal(true);
  const closeModal = () => setOpenModal(false);
  const currentProjectId = location.state.projectId;
  const currentProjectName = location.state.projectName;
  console.log(location.state.projectId); //for checking purposes
  console.log(location.state.projectName);

  const fetchUserName = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();

      setName(data.name);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching user data");
    }
  };

  useEffect(() => {
    //if (loading) return;
    if (!user) return navigate("/");
    fetchUserName();
  }, [user]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const toDashboard = () => {
    navigate("/dashboard", {
      state: { projectName: currentProjectName, projectId: currentProjectId },
    });
  };

  const toHome = () => {
    navigate("/home", {
      state: { projectName: currentProjectName, projectId: currentProjectId },
    });
  };

  const toDeadline = () => {
    navigate("/deadline", {
      state: { projectName: currentProjectName, projectId: currentProjectId },
    });
  };

  const toTask = () => {
    navigate("/task", {
      state: { projectName: currentProjectName, projectId: currentProjectId },
    });
  };

  const toNotes = () => {
    navigate("/notes", {
      state: { projectName: currentProjectName, projectId: currentProjectId },
    });
  };

  function OverviewBox() {
    return (
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          backgroundColor: "white",
          padding: "35px",
          width: "300px",
        }}
      >
        <h2>Overview</h2>
        <Typography>
          Quack <strong>{name}</strong>!
        </Typography>
        <p>
          <Typography marginBottom={2}>
            Current Project: <strong>{currentProjectName}</strong>
          </Typography>
        </p>
      </Paper>
    );
  }

  return (
    <div className="home">
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
          sx={{ backgroundColor: "#ffbd59", color: "#694729" }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Producktive
            </Typography>
            <Box sx={{ display: "flex", marginLeft: "10px", marginTop: "2px" }}>
              <MenuItem onClick={toDashboard}>
                <Typography variant="button">Dashboard</Typography>
              </MenuItem>
              <MenuItem onClick={showModal}>
                <Typography variant="button">Share</Typography>
              </MenuItem>
            </Box>

            <IconButton
              sx={{
                p: 1,
                position: "absolute",
                top: 3,
                right: 15,
              }}
            >
              <Avatar
                alt={name}
                src={user?.photoURL}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenu}
              />
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={toHome}>
                <ListItemIcon>
                  <HomeIcon />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={toDeadline}>
                <ListItemIcon>
                  <CalendarMonthIcon />
                </ListItemIcon>
                <ListItemText primary="Deadline Tracker" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={toTask}>
                <ListItemIcon>
                  <AssignmentIndIcon />
                </ListItemIcon>
                <ListItemText primary="Task Distributor" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={toNotes}>
                <ListItemIcon>
                  <NotesIcon />
                </ListItemIcon>
                <ListItemText primary="Note" />
              </ListItemButton>
            </ListItem>
          </List>
        </Drawer>
        <Mod
          openModal={openModal}
          closeModal={closeModal}
          currentProjectId={currentProjectId}
          currentProjectName={currentProjectName}
        />
        <Main open={open}>
          <DrawerHeader />
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <div className="box">
              <OverviewBox />
            </div>
            <div className="box">
              <DeadlineBox projectId={location.state.projectId} />
            </div>
          </Box>
        </Main>
      </Box>
    </div>
  );
}

export default Home;
