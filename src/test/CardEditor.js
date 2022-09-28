import "./CardEditor.css";

import React, { Component } from "react";
import EditButtons from "./EditButtons";
import { Paper, Input } from "@mui/material";

class CardEditor extends Component {
  state = {
    text: this.props.text || "",
  };

  handleChangeText = (e) => this.setState({ text: e.target.value });

  onEnter = (e) => {
    const { text } = this.state;

    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.onSave(text);
    }
  };

  render() {
    const { text } = this.state;
    const { onSave, onCancel, onDelete, adding } = this.props;

    return (
      <div>
        <div className="editCard-Card">
          <Paper sx={{ background: "#fae29c;", p: 2 }}>
            <Input
              placeholder="Enter task"
              autoFocus
              className="editCard-Textarea"
              value={text}
              onChange={this.handleChangeText}
              onKeyDown={this.onEnter}
              multiline
            />
          </Paper>
        </div>
        <EditButtons
          handleSave={() => onSave(text)}
          saveLabel={adding ? "Add task" : "Save"}
          handleDelete={onDelete}
          handleCancel={onCancel}
        />
      </div>
    );
  }
}

export default CardEditor;
