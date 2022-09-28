import "./Card.css";
import { db } from "../firebase";
import React, { Component } from "react";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import CardEditor from "./CardEditor";
import EditIcon from "@mui/icons-material/Edit";
import DoneIcon from "@mui/icons-material/Done";

class Card extends Component {
  state = {
    hover: false,
    editing: false,
  };

  startHover = () => this.setState({ hover: true });
  endHover = () => this.setState({ hover: false });

  startEditing = () =>
    this.setState({
      hover: false,
      editing: true,
      text: this.props.card.text,
    });

  endEditing = () => this.setState({ hover: false, editing: false });

  editCard = async (text) => {
    const { card, listId, projectId } = this.props;
    try {
      const ref = doc(
        db,
        "projects",
        projectId,
        "lists",
        listId,
        "tasks",
        card.id
      );
      await updateDoc(ref, {
        task: text,
      });
      this.endEditing();
    } catch (error) {
      console.log(error);
      alert("Task could not be updated");
    }
  };

  deleteCard = async () => {
    const { card, listId, projectId } = this.props;
    try {
      await deleteDoc(
        doc(db, "projects", projectId, "lists", listId, "tasks", card.id)
      );
    } catch (error) {
      console.log(error);
      alert("Task could not be deleted");
    }
  };

  render() {
    const { card } = this.props;
    const { hover, editing } = this.state;

    if (!editing) {
      return (
        <div>
          <div
            className="card"
            onMouseEnter={this.startHover}
            onMouseLeave={this.endHover}
          >
            {hover && (
              <div className="cardIcons">
                <div className="cardIcon" onClick={this.startEditing}>
                  <EditIcon />
                </div>
                <div className="cardIcon" onClick={this.deleteCard}>
                  <DoneIcon />
                </div>
              </div>
            )}

            {card.data.task}
          </div>
        </div>
      );
    } else {
      return (
        <CardEditor
          text={card.data.task}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }
}

export default Card;
