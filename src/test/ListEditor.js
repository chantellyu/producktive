import "./ListEditor.css";

import React, { Component } from "react";
import { TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

class ListEditor extends Component {
  onEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.saveList();
    }
  };

  render() {
    const { title, handleChangeTitle, deleteList } = this.props;

    return (
      <div className="listTitleEdit">
        <TextField
          id="edit-name"
          label="Name"
          variant="outlined"
          multiline
          margin="dense"
          value={title}
          onChange={handleChangeTitle}
          sx={{
            width: deleteList ? 245 : 269,
            p: "6px 1px",
          }}
          onKeyDown={this.onEnter}
          autoFocus
        />
        {deleteList && (
          <div className="listButtonCancel" onClick={deleteList}>
            <DeleteIcon />
          </div>
        )}
      </div>
    );
  }
}

export default ListEditor;
