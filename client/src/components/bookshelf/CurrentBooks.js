import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Table, Button } from "reactstrap";
import axios from "axios";

class CurrentBooks extends Component {
  onFinishBook = e => {
    e.preventDefault();
    const { location } = this.props;

    axios
      .post(`/api/profile/book_past/${e.target.id}`)
      .then(res => window.location.reload())
      .catch(err => console.log(err));
  };

  render() {
    const { books, user } = this.props;
    let content;

    if (books.length > 0) {
      const bookList = books.map(book => (
        <tr key={book._id}>
          <th scope="row">
            <img
              className="w-25 d-block mx-auto"
              src={book.imgUrl}
              alt={book.title}
            />
          </th>
          <td className="align-middle text-center">{book.title}</td>
          <td className="align-middle text-center">{book.author}</td>
          <td className="align-middle">
            <Button
              size="lg"
              color="info"
              id={book._id}
              className="mx-auto"
              onClick={this.onFinishBook}
            >
              Finished Book
            </Button>
          </td>
        </tr>
      ));

      content = (
        <div>
          <Link
            to={`add_book/profile/${user.id}/current`}
            className="btn btn-lg btn-info mt-3 mb-5"
          >
            Add a book
          </Link>
          <Table hover>
            <thead>
              <tr>
                <th />
                <th className="text-center">Title</th>
                <th className="text-center">Author</th>
                <th />
              </tr>
            </thead>
            <tbody>{bookList}</tbody>
          </Table>
        </div>
      );
    } else {
      // User is logged in but has no profile
      content = (
        <div>
          <p>
            You do not have any books in your current books. Click{" "}
            <span className="font-italic">"Add a book"</span> to add one.
          </p>
          <Link
            to={`add_book/profile/${user.id}/current`}
            className="btn btn-lg btn-info"
          >
            Add a book
          </Link>
        </div>
      );
    }

    return (
      <div className="mb-5">
        <h4 className="text-muted">Current Books</h4>
        {content}
      </div>
    );
  }
}

CurrentBooks.propTypes = {
  books: PropTypes.array.isRequired
};

export default CurrentBooks;
