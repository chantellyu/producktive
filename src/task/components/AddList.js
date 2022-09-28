import "../styles/AddList.css";

import React, { Component } from "react";
import { connect } from "react-redux";
import ListEditor from "./ListEditor";
import shortid from "shortid";
import EditButtons from "./EditButtons";
import Paper from "@mui/material/Paper";

class AddList extends Component {
  state = {
    title: "",
  };

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  createList = async () => {
    const { title } = this.state;
    const { dispatch } = this.props;

    this.props.toggleAddingList();

    dispatch({
      type: "ADD_LIST",
      payload: { listId: shortid.generate(), listTitle: title },
    });
  };

  render() {
    const { toggleAddingList } = this.props;
    const { title } = this.state;

    return (
      <Paper className="Add-List-Editor" sx={{ background: "#fff6e5" }}>
        <ListEditor
          title={title}
          handleChangeTitle={this.handleChangeTitle}
          //onClickOutside={toggleAddingList}
          saveList={this.createList}
        />

        <EditButtons
          handleSave={this.createList}
          saveLabel={"Add name"}
          handleCancel={toggleAddingList}
        />
      </Paper>
    );
  }
}

export default connect()(AddList);
