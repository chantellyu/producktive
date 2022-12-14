import "../styles/Card.css";

import React, { Component } from "react";
import { connect } from "react-redux";

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
    const { card, dispatch } = this.props;

    this.endEditing();

    dispatch({
      type: "CHANGE_CARD_TEXT",
      payload: { cardId: card._id, cardText: text },
    });
  };

  deleteCard = async () => {
    const { listId, card, dispatch } = this.props;

    dispatch({
      type: "DELETE_CARD",
      payload: { cardId: card._id, listId },
    });
  };

  render() {
    const { card, index } = this.props;
    const { hover, editing } = this.state;

    if (!editing) {
      return (
        <div>
          <div
            className="Card"
            onMouseEnter={this.startHover}
            onMouseLeave={this.endHover}
          >
            {hover && (
              <div className="Card-Icons">
                <div className="Card-Icon" onClick={this.startEditing}>
                  <EditIcon />
                </div>
                <div className="Card-Icon" onClick={this.deleteCard}>
                  <DoneIcon />
                </div>
              </div>
            )}

            {card.text}
          </div>
        </div>
      );
    } else {
      return (
        <CardEditor
          text={card.text}
          onSave={this.editCard}
          onDelete={this.deleteCard}
          onCancel={this.endEditing}
        />
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => ({
  card: state.cardsById[ownProps.cardId],
});

export default connect(mapStateToProps)(Card);
