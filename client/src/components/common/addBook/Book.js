import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { addToBookshelf } from "../../../actions/profileActions";
import { addToClubBookshelf } from "../../../actions/clubActions";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Row,
  CardText,
  Button
} from "reactstrap";

class Book extends Component {
  onAddBookClick = () => {
    const { book, params, history } = this.props;
    let isbn;

    book.industryIdentifiers[0].type === "ISBN_13"
      ? (isbn = book.industryIdentifiers[0].identifier)
      : (isbn = book.industryIdentifiers[1].identifier);

    const bookData = {
      isbn: isbn,
      title: book.title,
      author: book.authors[0],
      publisher: book.publisher,
      imgUrl: book.imageLinks.smallThumbnail
    };

    if (params.type === "profile") {
      this.props.addToBookshelf(params.type, params.time, bookData, history);
    } else if (params.type === "club") {
      this.props.addToClubBookshelf(
        params.type,
        params.id,
        params.time,
        bookData,
        history
      );
    }
  };

  onPreviewClick = url => {
    window.open(url, "_blank");
    window.open(url);
  };

  render() {
    const { book } = this.props;
    let shortDesc;

    const orginalLength = book.description.length;
    const maxLength = 160;

    shortDesc = book.description.substr(0, maxLength);

    shortDesc = shortDesc.substr(
      0,
      Math.min(shortDesc.length, shortDesc.lastIndexOf(" "))
    );

    if (orginalLength > maxLength) {
      shortDesc += "...";
    }

    return (
      <Col md="6" className="mb-5 text-center">
        <Card>
          <CardBody>
            <Row className="mb-3">
              <Col md="3">
                <img src={book.imageLinks.smallThumbnail} alt={book.title} />
              </Col>
              <Col>
                <CardTitle>{book.title}</CardTitle>
                <CardText className="p-2">{shortDesc}</CardText>
              </Col>
            </Row>
            <Row className="p-2">
              <Col md="6">
                <Button
                  onClick={() => this.onPreviewClick(book.previewLink)}
                  color="info"
                  className="col-md-8"
                >
                  Preview
                </Button>
              </Col>
              <Col md="6">
                <Button
                  onClick={this.onAddBookClick}
                  color="info"
                  className="col-md-8"
                >
                  Add Book
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    );
  }
}

Book.propTypes = {
  addToBookshelf: PropTypes.func.isRequired
};

export default connect(
  null,
  { addToBookshelf, addToClubBookshelf }
)(withRouter(Book));
