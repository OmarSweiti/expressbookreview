# Book Review API

A RESTful API for a book shop, built with **Node.js** and **Express**. Anyone can browse the
catalogue and read reviews; registered customers authenticate with JWT and can add, edit, or delete
their own review — and only their own.

Built as the final project for the *Developing Back-End Apps with Node.js and Express* course
(IBM / Coursera).

## Tech Stack

| | |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express 4 |
| **Auth** | `jsonwebtoken` (JWT) + `express-session` |
| **Storage** | In-memory book database (`booksdb.js`) |
| **Dev** | `nodemon` |

## Architecture

```
final_project/
├── index.js              # App entry — session config, JWT auth middleware, route mounting
└── router/
    ├── general.js        # Public routes  (mounted at /)
    ├── auth_users.js     # Customer routes (mounted at /customer)
    └── booksdb.js        # Seed data — 10 classic titles
```

Authentication is enforced by middleware on `/customer/auth/*`. The middleware pulls the access
token from the session, verifies it, and attaches the username to the request — so review routes
can check ownership before allowing a write.

## API Reference

### Public — no authentication

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | List every book in the catalogue |
| `GET` | `/isbn/:isbn` | Get one book by ISBN |
| `GET` | `/author/:author` | Get all books by an author |
| `GET` | `/title/:title` | Get all books matching a title |
| `GET` | `/review/:isbn` | Get all reviews for a book |
| `POST` | `/register` | Register a new user |

### Customer — requires login

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/customer/register` | Register a new customer |
| `POST` | `/customer/login` | Log in and receive a session-stored JWT |
| `PUT` | `/customer/auth/review/:isbn` | Add or update **your** review for a book |
| `DELETE` | `/customer/auth/review/:isbn` | Delete **your** review for a book |

A customer can only modify a review they authored. Submitting a review for a book you have already
reviewed updates the existing one rather than creating a duplicate.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone https://github.com/OmarSweiti/expressbookreview.git
cd expressbookreview/final_project
npm install
npm start
```

The server starts on **http://localhost:5000**.

## Usage

Register, then log in — the JWT is stored in the session, so subsequent authenticated requests need
the session cookie:

```bash
# Register
curl -X POST http://localhost:5000/customer/register \
  -H "Content-Type: application/json" \
  -d '{"username":"omar","password":"secret"}'

# Log in (save the session cookie)
curl -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"omar","password":"secret"}' \
  -c cookies.txt

# Add a review
curl -X PUT "http://localhost:5000/customer/auth/review/1?review=A%20masterpiece" \
  -b cookies.txt

# Read it back — publicly
curl http://localhost:5000/review/1
```

## Notes

The book catalogue lives in memory, so data resets on restart. Swapping `booksdb.js` for a real
database layer is the natural next step — the router modules are already isolated from the storage
implementation.

## License

[MIT](LICENSE)
