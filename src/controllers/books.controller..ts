import { IBook } from "../schema/book.schema";
import { User } from "../models/user.models";
import { IUser } from "../schema/user.schema";
import { Request, Response } from "express";

export const getBookUser = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then((user: IUser | null) => {
      if (user) {
        const userBooks = user.books;
        res.send(userBooks);
      }
    })
    .catch((err: Error) => {
      res.send({
        message: `Error ${err}`,
        valid: false
      })
    })
}

export const searchBookByTitleUser = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then((user: IUser | null) => {
      if (user) {
        const matchingBook: IBook = user.books.find((book: IBook) => book.title === req.params.title);
        if (matchingBook) {
          const imageDataURL = matchingBook.image ? `data:image/jpeg;base64,${matchingBook.image.toString('base64')}` : null;
          const responseData = {
            title: matchingBook.title,
            author: matchingBook.author,
            publishYear: matchingBook.publishYear,
            description: matchingBook.description,
            image: imageDataURL
          }
          res.send(responseData);
        } else {
          res.send({
            message: "No record"
          });
        }
      }
    })
    .catch((err: Error) => {
      res.send({
        message: `Error ${err}`
      })
    })
}

export const addBookUser = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then((user: IUser | null) => {
      if (user) {
        if (!req.body.inputTitle || !req.body.inputAuthor || !req.body.inputPublishYear) {
          return res.send({ message: "Please fill out missing fields.", valid: false });
        }

        const newBook = {
          title: req.body.inputTitle,
          author: req.body.inputAuthor,
          publishYear: parseInt(req.body.inputPublishYear, 10),
          description: req.body.inputDescription,
          image: req.file ? req.file.buffer : undefined,
        };

        User.updateOne({ email: req.body.email }, { $push: { books: newBook } })
          .then(() => {
            res.send({
              message: `Successfully added ${newBook.title}`,
              valid: true
            });
          })
          .catch((err: Error) => {
            res.send({
              message: `Error ${err}`,
              valid: false
            })
          });
      }
    })
    .catch((err: Error) => {
      res.send({
        message: `Error ${err}`,
        valid: false
      });
    })
}

export const updateBookUser = (req: Request, res: Response) => {
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then((user: IUser | null) => {
      if (user) {
        const matchedBookIndex = user.books.findIndex((book: IBook) => book.title === req.params.title);
        if (matchedBookIndex !== -1) {
          const updatedBook = {
            title: req.body.title || user.books[matchedBookIndex].title,
            author: req.body.author || user.books[matchedBookIndex].author,
            publishYear: req.body.publishYear || user.books[matchedBookIndex].publishYear,
            description: req.body.description,
          };
          console.log(updatedBook);
          user.books[matchedBookIndex] = updatedBook;
          User.updateOne(
            { email: req.body.email },
            { $set: { books: user.books } },
            { runValidators: true, context: 'query' }
          )
            .then(() => {
              res.send({
                message: `Updated ${req.params.title} to ${updatedBook.title}`,
                valid: true,
              });
            })
            .catch((err: Error) => {
              res.send({
                message: `Error updating book: ${err}`,
                valid: false,
              });
            });
        } else {
          res.send({
            message: `Book with title '${req.params.title}' not found for the user.`,
            valid: false,
          });
        }
      } else {
        res.send({
          message: 'User not found',
          valid: false,
        });
      }
    })
    .catch((err: Error) => {
      res.send({
        message: `Error finding user: ${err}`,
        valid: false,
      });
    });
};

export const deleteBookUser = (req: Request, res: Response) => {
  User.findOne({ email: req.body.email })
    .then((user: IUser | null) => {
      const matchedBook: IBook = user?.books.find((books: IBook) => books.title === req.params.title);
      if (matchedBook) {
        User.updateOne({ email: user?.email }, { $pull: { books: matchedBook } })
          .then(() => {
            res.send({
              message: `Successfully deleted a book with the title of ${matchedBook.title}`,
              valid: true
            });
          })
          .catch((err: Error) => {
            res.send({
              message: "Error deleting a book",
              valid: false
            })
          })
      } else {
        res.send({
          message: "Book not found",
          valid: false
        });
      }
    })
    .catch(() => {
      res.send({
        message: "User not currently logged in",
        valid: false
      });
    })
}

export const addedBooksByMonthUser = (req: Request, res: Response) => {
  const currentYear = new Date().getFullYear();
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  User.aggregate([
    {
      $match: {
        'email': req.body.email,
        'books.createdAt': {
          $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
          $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
        },
      },
    },
    {
      $unwind: '$books',
    },
    {
      $group: {
        _id: { $month: '$books.createdAt' },
        bookCount: { $sum: 1 },
      },
    },
  ])
    .then((result) => {
      const booksByMonth = months.map((month, index) => ({
        month,
        bookCount: result.find((item) => item._id === index + 1)?.bookCount || 0,
      }));

      res.send({ booksByMonth });
    })
    .catch((error) => {
      console.error('Error:', error);
      res.status(500).send({ message: 'Internal Server Error' });
    });
};


