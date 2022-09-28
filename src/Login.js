import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, signInWithGoogle } from "./firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./Login.css";
import {
  Typography,
  Button,
  TextField,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    //if (user) navigate("/dashboard");
    if (user) navigate("/dashboard");
  }, [user, loading]);

  return (
    <div className="login">
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
        <h1>WELCOME!</h1>
        <TextField
          sx={{ marginBottom: "10px" }}
          id="outlined-basic"
          label="E-mail Address"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          id="outlined-basic"
          type={showPassword ? "text" : "password"}
          label="Password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
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
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </Button>
        <Button
          variant="contained"
          endIcon={<GoogleIcon />}
          style={{
            padding: "10px",
            marginBottom: "10px",
          }}
          onClick={signInWithGoogle}
        >
          Login with Google
        </Button>
        <Typography>
          <Link to="/reset">Forgot Password</Link>
        </Typography>
        <Typography marginTop="7px">
          Don't have an account? Register <Link to="/register">here</Link>.
        </Typography>
      </Paper>
    </div>
  );
}

export default Login;
