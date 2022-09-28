import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "./firebase";
import Outer from "./Outer";
import { styled } from "@mui/material/styles";
import {
  query,
  collection,
  getDocs,
  addDoc,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import "./Notes.css";
import {
  Button,
  Paper,
  Typography,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  FormControl,
  Fab,
  InputLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function FormDialog({
  open,
  handleClose,
  note,
  setNote,
  category,
  categories,
  addNote,
  setSuccessC,
  setCategory,
  projectId,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [user] = useAuthState(auth);

  const addNewCategory = async () => {
    try {
      await addDoc(collection(db, "projects", projectId, "category"), {
        category: newCategory,
        uid: user.uid,
      });
      setCategory(newCategory);
      setSuccessC(true);
      /*alert("Category Added");*/
    } catch (error) {
      alert("Category could not be added");
    }
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Note</DialogTitle>
        <DialogContent>
          <FormControl fullWidth>
            <TextField
              id="name"
              label="Note"
              type="text"
              fullWidth
              multiline
              inputProps={{ maxLength: 300 }}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="standard"
            />
          </FormControl>
          <FormControl variant="standard" fullWidth sx={{ mt: 1 }}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem disabled value="">
                <em>Select Category</em>
              </MenuItem>
              {categories.map((e) => (
                <MenuItem value={e.category}>{e.category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <TextField
              id="name"
              label="Add New Category"
              type="text"
              fullWidth
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              variant="standard"
            />
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "black",
                padding: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              onClick={addNewCategory}
            >
              Add Category
            </Button>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={addNote}>Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const Notes = () => {
  const [user, loading, error] = useAuthState(auth);
  const [successC, setSuccessC] = useState(false);
  const [successD, setSuccesD] = useState(false);
  const [successU, setSuccessU] = useState(false);
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [edit, setEdit] = useState(false);
  const [noted, setNoted] = useState(0);
  const [categories, setCateogories] = useState([]);
  const [category, setCategory] = useState("Select Category");
  const navigate = useNavigate();
  const location = useLocation();
  const projectName = location.state.projectName;
  const projectId = location.state.projectId;
  const PREFIX = "Notes";
  const classes = {
    addButton: `${PREFIX}-addButton`,
  };

  const StyledFab = styled(Fab)(({ theme }) => ({
    [`&.${classes.addButton}`]: {
      backgroundColor: "#febb58",
      color: "#694729",
      position: "fixed",
      bottom: theme.spacing(3),
      right: theme.spacing(4),
    },
  }));
  const fetchNotes = async () => {
    try {
      const q = query(collection(db, "projects", projectId, "notes"));
      const c = query(collection(db, "projects", projectId, "category"));
      const doc = await getDocs(q);
      const cDoc = await getDocs(c);
      let n = [];
      doc.docs.forEach((element) => {
        n.push(element.data());
      });
      let ca = [];
      cDoc.docs.forEach((element) => {
        ca.push(element.data());
      });
      setCateogories(ca);
      setNotes(n);
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching notes");
    }
  };

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const changer = (e) => {
    setEdit(!edit);
    setNoted(e.id);
  };

  const addNote = async () => {
    try {
      let identify = Date.now().toString();
      await setDoc(doc(db, "projects", projectId, "notes", identify), {
        uid: user.uid,
        id: identify,
        note,
        category,
      });
      setOpen(false);
      setSuccessC(!successC);
      /*alert("Note Added");*/
    } catch (error) {
      alert("Note could not be added");
    }
  };

  const deleteNote = async (e) => {
    try {
      if (window.confirm("Do you want to delete note?")) {
        await deleteDoc(doc(db, "projects", projectId, "notes", e.id));
        setSuccesD(!successD);
        /*alert("Note Deleted");*/
      }
    } catch (error) {
      console.log(error);
      alert("Note could not be deleted");
    }
  };
  const updateNote = async (e) => {
    try {
      const ref = doc(db, "projects", projectId, "notes", e.id);
      await updateDoc(ref, {
        note: note,
      });
      setSuccessU(true);
      setEdit(false);
      /*alert("Note updated");*/
    } catch (error) {
      console.log(error);
      alert("Note could not be updated");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchNotes();
  }, [user, loading, successC, successD, successU]);
  return (
    <Outer projectName={projectName} projectId={projectId}>
      <StyledFab className={classes.addButton} onClick={handleClickOpen}>
        <AddIcon />
      </StyledFab>
      <FormDialog
        open={open}
        addNote={addNote}
        category={category}
        setCategory={setCategory}
        note={note}
        setNote={setNote}
        handleClose={handleClose}
        handleClickOpen={handleClickOpen}
        categories={categories}
        setSuccessC={setSuccessC}
        projectId={projectId}
      />
      <div className="notesContainer">
        {notes.map((e) => (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              backgroundColor: "#fff6e5",
              width: "330px",
              padding: "15px",
              margin: "8px",
              minHeight: "320px",
              maxHeight: "600px",
              position: "relative",
            }}
          >
            <Typography color={"#422f1e"} mt={1} mb={1} variant="subtitle2">
              Category: {e.category}
            </Typography>
            <Typography variant="body1">
              {e.note}

              {edit && noted == e.id ? (
                <>
                  <FormControl fullWidth>
                    <TextField
                      autoFocus
                      fullWidth
                      multiline
                      inputProps={{ maxLength: 300 }}
                      sx={{ mt: "20px", mb: "50px" }}
                      id="name"
                      label="Note"
                      type="text"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      variant="standard"
                    />
                  </FormControl>
                  <div className="notesButton">
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor: "#fae29c",
                        color: "#694729",
                        padding: "5px",
                        width: "90px",
                      }}
                      onClick={() => updateNote(e)}
                    >
                      Update
                    </Button>
                  </div>
                </>
              ) : (
                <div className="notesButton">
                  <Button
                    variant="contained"
                    style={{
                      color: "#694729",
                      backgroundColor: "#fae29c",
                      padding: "5px",
                      marginRight: "5px",
                      width: "80px",
                    }}
                    onClick={() => deleteNote(e)}
                  >
                    Delete
                  </Button>
                  <Button
                    variant="contained"
                    style={{
                      color: "#694729",
                      backgroundColor: "#fae29c",
                      padding: "5px",
                      width: "80px",
                    }}
                    onClick={() => changer(e)}
                  >
                    Edit
                  </Button>
                </div>
              )}
            </Typography>
          </Paper>
        ))}
      </div>
    </Outer>
  );
};

export default Notes;
