# workast-slack-api

Api Rest + Slack Integration Workast project

## Introduction

This project is an API REST integrated with Slack API. The main purpose is to automatize send of messages when some user adds a new article. Also, it can look for articles with 1 or more tags

## Flow

mainRoute = `http://localhost:3007/workast-api/v1`

### Steps

1.  (POST) Create a new user. Route: `${mainRoute}/users`. Required fields: `name, avatar`
2.  (POST) Create a new article. Include the user's `_id` returned in previous step. Route: `${mainRoute}/articles`. Required fields: `userId, title, text`. Optional fields: `tags`
3.  Check your _#general_ channel! there must be a new message with article's `text` and user `name`
4.  (PUT) Edit your article. Remember that it's a `PUT` and not a `PATCH` so you must send a complete new body. Route: `${mainRoute}/articles/<articleId>`. Required fields: `userId, title, text`. Optional fields: `tags`
5.  (GET) Check the article edited. You can send a `tags` query param and filter them. If the article contains **1 or more** it will be included. Route: `${mainRoute}/articles`
6.  (DELETE) Delete a specific article. Route: `${mainRoute}/articles/<articleId>`.

## Components

- Routes + Controller
- Auth Middleware
- Mongo DB
- Slack Integration
- Tests

## Strategies

### WorkFlow

The project was designed following an **iterative and inremental** methodology where every iteration achieves a specific goal. It was developed simulating that all iterations must be finished with all tests and funtionalities working correctly.

### Git Flow

The git flow chosen was feature branch workflow following that every iteration must have a specific branch with specific tests. When it was finished, it submits a _Pull Request_ simulating that other partner must approval to allow branch merge

### TDD

The Project was developed following the TDD paradigm where all tests must be defined first and after that the code must be writed to accomplish the green in tests. It produced a bit more of work because all feature branches must had their own test but it allowed to accomplish the right requirements plus write only neccessary code in an effective way

## Slack Integration

To achieve [Step](#Steps) 3. the project includes an integration with Slack API.

On One hand, it includes a flow to integrate that funtionality in `articles->createOne` Controller.

On the other Hand that integration includes **Unit** and **Integration** tests. Firstone only test funtionality and the other the full createOne flow (it is developed in [articlesSpec->createOneSpec.js](https://github.com/MatiNavDev/workast-slack-api/blob/master/server/spec/articlesSpec/createOneSpec.js))

## Auth Middleware

The application includes a simple auth middleware in all requests. It only verifies that the actual request includes a **json web token** with `JWT_SECRET` enviroment var.

## Design Patterns

- Responses: for the request responses it includes a simple **Strategy** that depending on response type it sends a `successfull` or `error` response
- DB Connection: to connect only one time to `DB` and maintaing active that connection in app life cicle it was developed using a **Singleton**
- Slac Connection: to connect only one time to `Slack API` and maintaing active that connection in app life cicle it was developed using a **Singleton**

---

## How to Set up

1. Run `npm i`
2. Add enviroment vars
3. Create your own Slack App, give it `chat:write` permissions and copy OAUTH token in `SLACK_OAUTH_TOKEN` environment var. Finally, Add it to your _#general_ channel.

---

## How to Run it

1. Run `node server/`
2. [Create a jwt](https://jwt.io/) with `JWT_SECRET` enviroment var and include this header `{Authorization: Bearer <jwt_generated>}` for all requests
3. Follow [Steps](#Steps) guide!

---

## How to Test it

1. npm run test
