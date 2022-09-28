import "../styles/List.css";

import React, { Component } from "react";
import { connect } from "react-redux";

import Card from "./Card";
import CardEditor from "./CardEditor";
import ListEditor from "./ListEditor";

import shortid from "shortid";
import Paper from "@mui/material/Paper";

class List extends Component {
  state = {
    editingTitle: false,
    title: this.props.list.title,
    addingCard: false,
  };

  toggleAddingCard = () =>
    this.setState({ addingCard: !this.state.addingCard });

  addCard = async (cardText) => {
    const { listId, dispatch } = this.props;

    this.toggleAddingCard();

    const cardId = shortid.generate();

    dispatch({
      type: "ADD_CARD",
      payload: { cardText, cardId, listId },
    });
  };

  toggleEditingTitle = () =>
    this.setState({ editingTitle: !this.state.editingTitle });

  handleChangeTitle = (e) => this.setState({ title: e.target.value });

  editListTitle = async () => {
    const { listId, dispatch } = this.props;
    const { title } = this.state;

    this.toggleEditingTitle();

    dispatch({
      type: "CHANGE_LIST_TITLE",
      payload: { listId, listTitle: title },
    });
  };

  deleteList = async () => {
    const { listId, list, dispatch } = this.props;

    dispatch({
      type: "DELETE_LIST",
      payload: { listId, cards: list.cards },
    });
  };

  render() {
    const { list } = this.props;
    const { editingTitle, addingCard, title } = this.state;

    return (
      <div>
        <Paper className="List" sx={{ background: "#fff6e5" }}>
          {editingTitle ? (
            <ListEditor
              list={list}
              title={title}
              handleChangeTitle={this.handleChangeTitle}
              saveList={this.editListTitle}
              onClickOutside={this.editListTitle}
              deleteList={this.deleteList}
            />
          ) : (
            <div className="List-Title" onClick={this.toggleEditingTitle}>
              {list.title}
            </div>
          )}

          <div>
            {list.cards &&
              list.cards.map((cardId, index) => (
                <Card
                  key={cardId}
                  cardId={cardId}
                  index={index}
                  listId={list._id}
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
            <div className="Toggle-Add-Card" onClick={this.toggleAddingCard}>
              <ion-icon name="add" /> Add task
            </div>
          )}
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  list: state.listsById[ownProps.listId],
});

export default connect(mapStateToProps)(List);
