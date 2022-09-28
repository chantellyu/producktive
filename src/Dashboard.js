import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { auth, db, logout } from "./firebase";
import {
  query,
  collection,
  getDocs,
  setDoc,
  getDoc,
  where,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import {
  Typography,
  Button,
  TextField,
  InputAdornment,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";
import AddIcon from "@mui/icons-material/Add";

function FormDialog({ open, handleCancel, fetchProjects }) {
  const [user] = useAuthState(auth);
  const [newProject, setNewProject] = useState("");
  const [existingProject, setExistingProject] = useState("");
  const handleClose = () => {
    setNewProject("");
    setExistingProject("");
    handleCancel();
  };
  const addProject = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const d = await getDocs(q);
      const id = d.docs[0].id;
      const ref = doc(db, "users", id);
      await updateDoc(ref, {
        projects: arrayUnion(newProject),
      });

      let projectId = Date.now().toString();
      await setDoc(doc(db, "projects", projectId), {
        projectName: newProject,
      });
      await setDoc(doc(db, "users", id, "projectId", newProject), {
        id: projectId,
      });
      fetchProjects();
      handleClose();
    } catch (error) {
      console.log(error);
      alert("Project could not be added");
    }
  };

  const addWithCode = async () => {
    try {
      const docRef = doc(db, "projects", existingProject);
      const docSnap = await getDoc(docRef);
      const name = docSnap.data().projectName;
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const d = await getDocs(q);
      const id = d.docs[0].id;
      const ref = doc(db, "users", id);
      await updateDoc(ref, {
        projects: arrayUnion(name),
      });
      await setDoc(doc(db, "users", id, "projectId", name), {
        id: existingProject,
      });
      fetchProjects();
      handleClose();
    } catch (error) {
      console.log(error);
      alert("Project could not be added");
    }
  };
  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Project</DialogTitle>
        <DialogContent sx={{ width: "390px" }}>
          <DialogContentText sx={{ color: "black" }}>
            Have a project code? Use it to add the project.
          </DialogContentText>
          <FormControl fullWidth sx={{ marginBottom: "25px" }}>
            <TextField
              id="code"
              label="Project Code"
              type="text"
              fullWidth
              value={existingProject}
              onChange={(e) => setExistingProject(e.target.value)}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="add" onClick={addWithCode}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <DialogContentText sx={{ color: "black" }}>
            No code? Just create a new project!
          </DialogContentText>
          <FormControl fullWidth>
            <TextField
              id="name"
              label="Project Name"
              type="text"
              fullWidth
              value={newProject}
              onChange={(e) => setNewProject(e.target.value)}
              variant="standard"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="add" onClick={addProject}>
                      <AddIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              inputProps={{ maxLength: 45 }}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

function Dashboard() {
  const [user] = useAuthState(auth);
  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);

  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const q = query(collection(db, "users"), where("uid", "==", user?.uid));
      const doc = await getDocs(q);
      const data = doc.docs[0].data();
      setProjects(data.projects); //get names of all projects created by current user
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching projects");
    }
  };

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
    fetchProjects();
  }, [user]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const toHome = async (project) => {
    const q = query(collection(db, "users"), where("uid", "==", user?.uid));
    const d = await getDocs(q);
    const docId = d.docs[0].id;
    const q2 = doc(db, "users", docId, "projectId", project);
    const d2 = await getDoc(q2);
    const projectId = d2.data().id;
    navigate("/home", {
      state: { projectName: project, projectId: projectId },
    });
  };

  return (
    <div className="dashboard">
      <AppBar
        position="absolute"
        sx={{ backgroundColor: "#ffbd59", color: "#694729" }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ marginLeft: "20px" }}
          >
            Producktive
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <IconButton
              onClick={handleMenu}
              sx={{ p: 1, position: "absolute", top: 3, right: 15 }}
            >
              <Avatar
                alt={name}
                src={user?.photoURL}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleMenu}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyItems: "flex-start",
          marginTop: 10,
          marginLeft: 2,
        }}
      >
        {projects.length !== 0 && (
          <div className="flexContainer">
            {projects.map((project, key) => (
              <Button
                key={key}
                variant="contained"
                sx={{
                  margin: 1,
                  width: "250px",
                  height: "150px",
                  wordWrap: "break-word",
                  whiteSpace: "normal",
                  background: "#fff6e5",
                  color: "black",
                  ":hover": { backgroundColor: "#faefd9" },
                }}
                onClick={() => toHome(project)}
              >
                {project}
              </Button>
            ))}
          </div>
        )}
        <Button
          variant="contained"
          sx={{
            margin: 1,
            width: "250px",
            height: "150px",
            background: "#fff6e5",
            color: "black",
            ":hover": { backgroundColor: "#faefd9" },
          }}
          onClick={handleOpen}
        >
          Add a project
        </Button>
        <FormDialog
          open={open}
          handleCancel={handleCancel}
          fetchProjects={fetchProjects}
        />
      </Box>
    </div>
  );
}

export default Dashboard;
