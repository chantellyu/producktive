import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { auth, sendPasswordReset } from "./firebase";
import "./Reset.css";
import { Typography, Button, TextField, Paper } from "@mui/material";

function Reset() {
  const [email, setEmail] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="reset">
      <Paper
        elevation={3}
        sx={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
          backgroundColor: "white",
          padding: "35px",
        }}
      >
        <h1>RESET</h1>
        <Typography variant="subtitle1" gutterBottom component="div">
          Password reset instructions will be sent to your email
        </Typography>
        <TextField
          id="outlined-basic"
          label="E-mail Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          onClick={() => sendPasswordReset(email)}
        >
          Reset
        </Button>
        <Typography>
          Don't have an account? Register <Link to="/register">here</Link>.
        </Typography>
      </Paper>
    </div>
  );
}

export default Reset;
