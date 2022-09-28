import "../styles/Board.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import List from "./List";
import AddList from "./AddList";
import Button from "@mui/material/Button";

class Board extends Component {
  state = {
    addingList: false,
  };

  toggleAddingList = () =>
    this.setState({ addingList: !this.state.addingList });

  render() {
    const { board } = this.props;
    const { addingList } = this.state;

    return (
      <div className="flex-container">
        {board.lists.map((listId, index) => {
          return <List listId={listId} key={listId} index={index} />;
        })}

        <div className="Add-List">
          {addingList ? (
            <AddList toggleAddingList={this.toggleAddingList} />
          ) : (
            <Button
              variant="contained"
              onClick={this.toggleAddingList}
              sx={{
                width: "300px",
                backgroundColor: "rgba(0, 0, 0, 0.25)",
                ":hover": { backgroundColor: "rgba(0, 0, 0, 0.5)" },
                //textTransform: "none",
              }}
            >
              + Add name
            </Button>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({ board: state.board });

export default connect(mapStateToProps)(Board);

//export default Board;
