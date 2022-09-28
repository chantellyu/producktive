import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import Outer from "./Outer";
import {
  query,
  collection,
  getDocs,
  where,
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
} from "@mui/material";

function FormDialog({
  note,
  setNote,
  addNote
}) {
  const [newCategory, setNewCategory] = useState("");
  const addNewCategory = async () => {
    try {
      await addDoc(collection(db, "category"), {
        category: newCategory,
      });
      setCategory(newCategory);
      setSuccessC(true);
      alert("Category Added");
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
              autoFocus
              margin="dense"
              id="name"
              label="Note"
              type="text"
              fullWidth
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="standard"
            />
          </FormControl>
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label">Category</InputLabel> */}
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              fullWidth
              variant="standard"
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
          <FormControl fullWidth>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Add new Category"
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
  const [notes, setNotes] = useState([]);
  const [date, setDate] = useState("");
  const navigate = useNavigate();
  const fetchDate = async () => {
    try {
      const q = doc(db, "deadline", "PzNJBi59G2ixnJET5lBw");
      const doc = await getDocs(q);
      setDate(doc.data());
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching date");
    }
  };

  const Date = async (e) => {
    try {
      const dateRef = doc(db, "deadline", e.id);
      await updateDoc(dateRef, {
        deadline: date,
      });
    } catch (error) {
      console.log(error);
      alert("Date could not be updated");
    }
  };
  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    fetchDate();
  }, [user, loading]);
  return (
    <Outer>
      <Button variant="outlined" onClick={handleClickOpen}>
        Add Note
      </Button>
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
      />
      <div className="notesContainer">
        {notes.map((e) => (
          <Paper
            elevation={2}
            sx={{
              display: "flex",
              flexDirection: "column",
              textAlign: "center",
              backgroundColor: "white",
              width: "400px",
              padding: "10px",
              margin: "5px",
              height: "400px",
            }}
          >
            <Typography variant="h6" gutterBottom component="div">
              Note
            </Typography>
            <Typography>
              {e.note}

              {edit && (
                <>
                  <FormControl fullWidth>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="name"
                      label="Note"
                      type="text"
                      fullWidth
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      variant="standard"
                    />
                  </FormControl>
                  <Button
                    variant="contained"
                    style={{
                      color: "white",
                      backgroundColor: "black",
                      padding: "10px",
                      marginTop: "20px",
                      marginBottom: "10px",
                    }}
                    onClick={() => updateNote(e)}
                  >
                    Update
                  </Button>
                </>
              )}
            </Typography>
            <Typography>{e.category}</Typography>
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "black",
                padding: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              onClick={() => deleteNote(e)}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              style={{
                color: "white",
                backgroundColor: "black",
                padding: "10px",
                marginTop: "20px",
                marginBottom: "10px",
              }}
              onClick={() => setEdit(!edit)}
            >
              Edit
            </Button>
          </Paper>
        ))}
      </div>
    </Outer>
  );
};

export default Notes;
