# Around the U.S. Back End

## Directories

`/routes` — routing files.

`/contollers` — contoller files.

`/models` — set schemas.

## Running the Project

`npm run start` — to launch the server.

`npm run dev` — to launch the server with the hot reload feature.

`npm run lint` — to ensure code integrity.

## API Documentation

| Request                                                    | Response                                       | Error                                                                                                                     |
| ---------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `GET http://localhost:3000/users`                          | JSON list of **all** users                     |                                                                                                                           |
| `GET http://localhost:3000/cards`                          | JSON list of **all** cards                     |                                                                                                                           |
| `GET http://localhost:3000/users/8340d0ec33270a25f2413b69` | JSON of a user with an ID passed after /users. | If it doesn't exist, the API should return 404 response status and the following JSON: { "message": "User ID not found" } |
| `Non-existent address or localhost:3000`                   |                                                | { "message": "Requested resource not found" }                                                                             |

`localhost:3000` should also return a 404 response as your front end is not yet connected to the back end. You can test your code in Postman.
