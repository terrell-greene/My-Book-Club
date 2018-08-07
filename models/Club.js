const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ClubSchema = new Schema({
  admin: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: "users"
    }
  ],
  name: {
    type: String,
    required: true,
    max: 30
  },
  description: {
    type: String,
    required: true
  },
  bookShelf: {
    booksPast: [
      {
        type: Schema.Types.ObjectId,
        ref: "books"
      }
    ],
    booksFuture: [
      {
        type: Schema.Types.ObjectId,
        ref: "books"
      }
    ],
    bookCurrent: {
      type: Schema.Types.ObjectId,
      ref: "books"
    }
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "posts"
    }
  ]
});

module.exports = Club = mongoose.model("clubs", ClubSchema);