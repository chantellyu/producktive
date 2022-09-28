import React, { Component } from "react";
import "./List.css";
import { Paper } from "@mui/material";
import { db } from "../firebase";
import {
  query,
  doc,
  onSnapshot,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";
import ListEditor from "./ListEditor";
import CardEditor from "./CardEditor";
import Card from "./Card";

class List extends Component {
  state = {
    editingTitle: false,
    title: this.props.list.data.name,
    addingCard: false,
    tasks: [],
  };

  fetchTasks = async () => {
    const { listId, projectId } = this.props;
    try {
      const q = query(
        collection(db, "projects", projectId, "lists", listId, "tasks"),
        orderBy("created", "asc")
      );

      onSnapshot(q, (doc) => {
        this.setState({
          tasks: doc.docs.map((doc) => ({ id: doc.id, data: doc.data() })),
        });
      });
    } catch (err) {
      console.error(err);
      alert("An error occured while fetching tasks");
    }
  };

  toggleAddingCard = () =>
    this.setState({ addingCard: !this.state.addingCard });

  addCard = async (cardText) => {
    const { listId, projectId } = this.props;
    if (cardText.length === 0) {
      alert("Missing field");
    } else {
      try {
        let identify = Date.now().toString();
        await addDoc(
          collection(db, "projects", projectId, "lists", listId, "tasks"),
          {
            id: identify,
            task: cardText,
            created: Timestamp.now(),
          }
        );
        this.toggleAddingCard();
      } catch (error) {
        alert("Task could not be added");
      }
    }
  };

  toggleEditingTitle = () =>
    this.setState({ editingTitle: !this.state.editingTitle });

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  updateList = async () => {
    const { listId, projectId } = this.props;
    const { title } = this.state;
    try {
      const ref = doc(db, "projects", projectId, "lists", listId);
      await updateDoc(ref, {
        name: title,
      });
      this.toggleEditingTitle();
    } catch (error) {
      console.log(error);
      alert("List could not be updated");
    }
  };

  deleteList = async () => {
    const { listId, projectId } = this.props;
    try {
      await deleteDoc(doc(db, "projects", projectId, "lists", listId));
    } catch (error) {
      console.log(error);
      alert("List could not be deleted");
    }
  };

  componentDidMount() {
    this.fetchTasks();
  }

  render() {
    const { list, listId, projectId } = this.props;
    const { editingTitle, addingCard, title, tasks } = this.state;

    return (
      <div>
        <Paper className="list" sx={{ background: "#fff6e5" }}>
          {editingTitle ? (
            <ListEditor
              list={list}
              title={title}
              handleChangeTitle={this.handleChangeTitle}
              saveList={this.updateList}
              onClickOutside={this.editListTitle}
              deleteList={this.deleteList}
            />
          ) : (
            <div className="listTitle" onClick={this.toggleEditingTitle}>
              {list.data.name}
            </div>
          )}

          <div>
            {tasks.map((task) => (
              <Card
                key={task.id}
                cardId={task.id}
                listId={listId}
                projectId={projectId}
                card={task}
              />
            ))}
          </div>

          {addingCard ? (
            <CardEditor
              onSave={this.addCard}
              onCancel={this.toggleAddingCard}
              adding
            />
          ) : (
            <div className="toggleAddCard" onClick={this.toggleAddingCard}>
              <ion-icon name="add" /> Add task
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

export default List;
