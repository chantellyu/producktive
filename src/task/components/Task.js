import "../styles/Task.css";

import React, { Component } from "react";
import Board from "./Board";
import OuterTask from "../OuterTask";

class Task extends Component {
  render() {
    return (
      <OuterTask>
        <Board />
      </OuterTask>
    );
  }
}

export default Task;
