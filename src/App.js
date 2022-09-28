import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.css";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Reset from "./Reset";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Deadline from "./Deadline";
import Notes from "./Notes2";
import Test from "./test/Test";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/reset" element={<Reset />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/deadline" element={<Deadline />} />
          <Route exact path="/task" element={<Test />} />
          <Route exact path="/notes" element={<Notes />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
