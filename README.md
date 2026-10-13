# Task 1 (Variant): Campus Library Books API

You are building the backend for a campus library catalog. Anyone can add, browse, update and delete books. There is no login.

Use **Express** and **MongoDB (Mongoose)** only. There is no frontend and no SQL.

---

## What's already done for you

The project already contains a complete **Product** CRUD API:

- `models/product.model.js`
- `controllers/product.controller.js`
- `routes/product.route.js`
- `index.js`: app setup, the database connection, and the `/api/products` router

Read these files first. They are your worked example: your book code should have the same structure (one function per route: DB call, then response).

**Do not change the Product code.**

---

## Project structure

```
simple-crud/
├── controllers/
│   ├── product.controller.js     (given)
│   └── book.controller.js        (you create)
├── models/
│   ├── product.model.js          (given)
│   └── book.model.js             (you create)
├── routes/
│   ├── product.route.js          (given)
│   └── book.route.js             (you create)
├── index.js                      (you add one line to mount your router)
├── package.json
└── .gitignore
```

---

## Setup

1. Install Node.js (LTS) and Git.
2. **Fork** this repository to your own GitHub account (the "Fork" button, top right). Do all of your work in your fork.
3. Clone **your fork** (not the original repository), then run:

```
git clone https://github.com/<your-username>/<repo-name>.git
cd <repo-name>
npm install
```

4. Create a file called `.env` in the project root (it must be listed in `.gitignore`, never commit it):

```
PORT=3000
MONGO_URI=<the connection string given in class>
```

5. Start the server:

```
npm run dev
```

If your project has no `dev` script, use `node index.js` instead.

6. Test your endpoints with Postman, Insomnia or Thunder Client.

> Note: everyone shares the same database cluster. Use distinctive book titles when testing so you don't collide with a classmate's data.

---

## What you need to build

Create three new files, then mount your router in `index.js` at `/api/books`.

### 1. The Book model: `models/book.model.js`

| field | type | rules |
|---|---|---|
| `title` | String | required, trimmed |
| `author` | String | required, trimmed |
| `genre` | String | enum: `fiction`, `science`, `history`, `technology`, `other`; default `other` |
| `publishedYear` | Number | `min: 1000`, optional |
| `shelfLocation` | String | optional (e.g. "Section C, Shelf 4") |
| `totalCopies` | Number | required, `min: 1` |
| `availableCopies` | Number | `min: 0`, default `1` |
| `isAvailable` | Boolean | default `true` |

Requirements:

- Add the `{ timestamps: true }` schema option.
- Add a **compound unique index** so the same book can't be added twice by the same author. Think about which fields it should include.
- Use Mongoose's built-in validators only. **Do not use Joi.**

### 2. Controller and routes

Write one function per route in `controllers/book.controller.js`, and wire them in `routes/book.route.js`. Choose the paths and HTTP methods yourself, following REST conventions.

| action | success response |
|---|---|
| Add a book | `201` with the created book |
| Get all books | `200` with an array of books |
| Get one book by id | `200` with the book |
| Update a book by id | `200` with the **updated** book |
| Delete a book by id | `200` with a confirmation message |

Rules:

- If the id is valid but no book exists, respond `404` with `{ "message": "Book not found" }`.
- Wrap each handler in `try/catch`. Return `500` with the error message for unexpected errors.
- On update, Mongoose validation must still run (for example, a `totalCopies` of 0 must be rejected). Find out which option is needed.
- On a duplicate book, respond `409` instead of `500`. Find out which error code MongoDB uses for this.

### 3. Stretch goal: filtering

Support query-string filtering on top of the base "get all books" route:

```
GET /api/books?genre=science&isAvailable=true
```

Only apply the conditions the client actually sent. With no query string, the route must still return every book.

Hint: query-string values always arrive as text. Think about what that means for `isAvailable`.

### 4. Stretch goal: recently added books

Add a route that returns the 5 most recently added books, newest first:

```
GET /api/books/recent
```

Make sure this route is not swallowed by your `/:id` route. Find out why the order of your routes matters. Look up how to sort by a field and how to limit the number of results.

---

## Testing checklist

Before you submit, make sure you can show each of these working:

- [ ] Add a book, and get `201` with the saved document
- [ ] Add the same book twice, and get `409`
- [ ] Add a book with `totalCopies: 0`, and get a validation error
- [ ] Add a book with a missing `author`, and get a validation error
- [ ] Get all books
- [ ] Get one book by a valid id
- [ ] Get a book with a valid id that doesn't exist, and get `404`
- [ ] Update a book, and the response shows the **new** values
- [ ] Update a book with `totalCopies: 0`, and it is rejected
- [ ] Delete a book, then confirm it is gone
- [ ] (Stretch) Filtering returns the right subset
- [ ] (Stretch) `/recent` returns at most 5 books, newest first

---

## Submission

1. Work in your fork, and commit regularly with clear messages. Your commit history shows your own work.
2. Push your commits to your fork:

```
git add .
git commit -m "Add book model, controller and routes"
git push origin main
```

3. In your fork, add a short section called `## API Examples` at the end of this README with **one example request and response for each route**.
4. Open a **pull request** from your fork to the `main` branch of the original repository. In the pull request description, write your full name and your student ID.
5. Make sure `.env` is not committed. If you accidentally pushed it, tell your instructor right away.

Do not edit the Product files. Pull requests that change them will be sent back.

---

## AI use

You're expected to use AI tools while building this. That's fine and expected.

But you remain responsible for all of the code you submit. You must be able to explain, for **any line in your controller**, why it's there and what happens if you delete it. We will ask.

---

## API Examples

All book routes are mounted at `/api/books`. Request bodies are JSON (`Content-Type: application/json`).

### Add a book

`POST /api/books`

```json
{
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "technology",
  "publishedYear": 1999,
  "shelfLocation": "Section C, Shelf 4",
  "totalCopies": 3,
  "availableCopies": 2
}
```

`201 Created`

```json
{
  "_id": "6709a1b4c3d2e10f8a7b4c01",
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "technology",
  "publishedYear": 1999,
  "shelfLocation": "Section C, Shelf 4",
  "totalCopies": 3,
  "availableCopies": 2,
  "isAvailable": true,
  "createdAt": "2026-10-13T11:42:08.512Z",
  "updatedAt": "2026-10-13T11:42:08.512Z",
  "__v": 0
}
```

Sending the same `title` and `author` again violates the compound unique index:

`409 Conflict`

```json
{ "message": "This book already exists" }
```

A body that breaks a validator, for example `"totalCopies": 0` or a missing `author`:

`400 Bad Request`

```json
{ "message": "Book validation failed: totalCopies: Total copies must be at least 1" }
```

### Get all books

`GET /api/books`

`200 OK`

```json
[
  {
    "_id": "6709a1b4c3d2e10f8a7b4c01",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "genre": "technology",
    "publishedYear": 1999,
    "shelfLocation": "Section C, Shelf 4",
    "totalCopies": 3,
    "availableCopies": 2,
    "isAvailable": true,
    "createdAt": "2026-10-13T11:42:08.512Z",
    "updatedAt": "2026-10-13T11:42:08.512Z",
    "__v": 0
  },
  {
    "_id": "6709a1b4c3d2e10f8a7b4c02",
    "title": "A Short History of Nearly Everything",
    "author": "Bill Bryson",
    "genre": "science",
    "publishedYear": 2003,
    "totalCopies": 5,
    "availableCopies": 5,
    "isAvailable": true,
    "createdAt": "2026-10-13T11:43:11.004Z",
    "updatedAt": "2026-10-13T11:43:11.004Z",
    "__v": 0
  }
]
```

### Get all books, filtered (stretch goal)

`GET /api/books?genre=science&isAvailable=true`

Only the conditions actually present in the query string are applied, so a request with no query string still returns every book.

`200 OK`

```json
[
  {
    "_id": "6709a1b4c3d2e10f8a7b4c02",
    "title": "A Short History of Nearly Everything",
    "author": "Bill Bryson",
    "genre": "science",
    "publishedYear": 2003,
    "totalCopies": 5,
    "availableCopies": 5,
    "isAvailable": true,
    "createdAt": "2026-10-13T11:43:11.004Z",
    "updatedAt": "2026-10-13T11:43:11.004Z",
    "__v": 0
  }
]
```

### Get the 5 most recently added books (stretch goal)

`GET /api/books/recent`

Returns at most 5 books, newest first. This route is declared before `/:id` in `routes/book.route.js` so that `recent` is not matched as an id.

`200 OK`

```json
[
  {
    "_id": "6709a1b4c3d2e10f8a7b4c02",
    "title": "A Short History of Nearly Everything",
    "author": "Bill Bryson",
    "genre": "science",
    "publishedYear": 2003,
    "totalCopies": 5,
    "availableCopies": 5,
    "isAvailable": true,
    "createdAt": "2026-10-13T11:43:11.004Z",
    "updatedAt": "2026-10-13T11:43:11.004Z",
    "__v": 0
  },
  {
    "_id": "6709a1b4c3d2e10f8a7b4c01",
    "title": "The Pragmatic Programmer",
    "author": "Andrew Hunt",
    "genre": "technology",
    "publishedYear": 1999,
    "shelfLocation": "Section C, Shelf 4",
    "totalCopies": 3,
    "availableCopies": 2,
    "isAvailable": true,
    "createdAt": "2026-10-13T11:42:08.512Z",
    "updatedAt": "2026-10-13T11:42:08.512Z",
    "__v": 0
  }
]
```

### Get one book by id

`GET /api/books/6709a1b4c3d2e10f8a7b4c01`

`200 OK`

```json
{
  "_id": "6709a1b4c3d2e10f8a7b4c01",
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "technology",
  "publishedYear": 1999,
  "shelfLocation": "Section C, Shelf 4",
  "totalCopies": 3,
  "availableCopies": 2,
  "isAvailable": true,
  "createdAt": "2026-10-13T11:42:08.512Z",
  "updatedAt": "2026-10-13T11:42:08.512Z",
  "__v": 0
}
```

A valid id with no matching book:

`404 Not Found`

```json
{ "message": "Book not found" }
```

### Update a book by id

`PUT /api/books/6709a1b4c3d2e10f8a7b4c01`

```json
{
  "shelfLocation": "Section A, Shelf 1",
  "totalCopies": 9
}
```

The response is the **updated** document, and the schema validators still run on the update.

`200 OK`

```json
{
  "_id": "6709a1b4c3d2e10f8a7b4c01",
  "title": "The Pragmatic Programmer",
  "author": "Andrew Hunt",
  "genre": "technology",
  "publishedYear": 1999,
  "shelfLocation": "Section A, Shelf 1",
  "totalCopies": 9,
  "availableCopies": 2,
  "isAvailable": true,
  "createdAt": "2026-10-13T11:42:08.512Z",
  "updatedAt": "2026-10-13T11:51:36.889Z",
  "__v": 0
}
```

Updating with `"totalCopies": 0` is rejected:

`400 Bad Request`

```json
{ "message": "Validation failed: totalCopies: Total copies must be at least 1" }
```

### Delete a book by id

`DELETE /api/books/6709a1b4c3d2e10f8a7b4c01`

`200 OK`

```json
{ "message": "Book deleted successfully" }
```

A following `GET` for the same id returns `404` with `{ "message": "Book not found" }`.
