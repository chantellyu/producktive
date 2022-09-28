import "../styles/ListEditor.css";

import React, { Component } from "react";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

class ListEditor extends Component {
  constructor(props) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  onEnter = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.props.saveList();
    }
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  handleClickOutside(e) {
    const node = this.wrapperRef.current;
    if (node.contains(e.target)) {
      return;
    }

    this.props.onClickOutside();
  }

  render() {
    const { title, handleChangeTitle, deleteList } = this.props;

    return (
      <div className="List-Title-Edit" ref={this.wrapperRef}>
        <TextField
          //id="outlined-basic"
          label="Name"
          variant="outlined"
          margin="dense"
          //autoFocus
          value={title}
          onChange={handleChangeTitle}
          onKeyDown={this.onEnter}
          sx={{
            width: deleteList ? 225 : 245,
            p: "6px 1px",
          }}
        />
        {deleteList && (
          <div tabIndex="0" className="List-Button-Cancel" onClick={deleteList}>
            <DeleteIcon />
          </div>
        )}
      </div>
    );
  }
}

export default ListEditor;
