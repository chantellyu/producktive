import "../styles/CardEditor.css";

import React, { Component } from "react";
import EditButtons from "./EditButtons";
import Input from "@mui/material/Input";

class CardEditor extends Component {
  state = {
    text: this.props.text || "",
  };

  handleChangeText = (event) => this.setState({ text: event.target.value });

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
      <div className="Edit-Card">
        <div className="Card">
          <Input
            placeholder="Enter task"
            autoFocus
            className="Edit-Card-Textarea"
            value={text}
            onChange={this.handleChangeText}
            onKeyDown={this.onEnter}
            multiline={2}
          />
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
