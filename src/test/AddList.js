import React, { Component } from "react";
import { db } from "../firebase";
import { collection } from "firebase/firestore";
import { Paper } from "@mui/material";
import { addDoc, Timestamp } from "firebase/firestore";
import "./AddList.css";
import ListEditor from "./ListEditor";
import EditButtons from "../task/components/EditButtons";

class AddList extends Component {
  state = {
    title: "",
  };

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  addList = async () => {
    const { title } = this.state;
    const { projectId } = this.props;
    if (title.length === 0) {
      alert("Missing field");
    } else {
      try {
        let identify = Date.now().toString();
        await addDoc(collection(db, "projects", projectId, "lists"), {
          id: identify,
          name: title,
          created: Timestamp.now(),
        });
        this.props.toggleAddingList();
      } catch (error) {
        alert("List could not be added");
      }
    }
  };

  render() {
    const { toggleAddingList } = this.props;
    const { title } = this.state;

    return (
      <Paper
        className="addListEditor"
        sx={{ background: "#fff6e5", width: 295 }}
      >
        <ListEditor
          title={title}
          handleChangeTitle={this.handleChangeTitle}
          saveList={this.addList}
        />

        <EditButtons
          handleSave={this.addList}
          saveLabel={"Add name"}
          handleCancel={toggleAddingList}
        />
      </Paper>
    );
  }
}

export default AddList;
