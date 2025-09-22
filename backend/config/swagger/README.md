# Swagger Documentation Structure

The Swagger documentation has been refactored into a modular structure for better maintainability and organization. This makes it easier to manage API documentation as the project grows.

## Directory Structure

```
backend/config/swagger/
├── schemas.js          # API data schemas (User, Room, Problem, etc.)
├── requestBodies.js    # Request body templates
├── parameters.js       # Common parameters (path, query, header)
└── endpoints/          # Endpoint definitions by feature
    ├── auth.js         # Authentication endpoints
    ├── users.js        # User management endpoints
    └── rooms.js        # Room management endpoints
```

## File Descriptions

### `schemas.js`
Contains all the data model schemas used across the API:
- User schema
- Room schema  
- Problem schema
- Competition schema
- Attempt schema
- Error and Success response schemas

### `requestBodies.js`
Defines reusable request body templates for different endpoints:
- Login request
- Registration request
- Room creation request
- Problem submission request
- And more...

### `parameters.js`
Common parameters used across multiple endpoints:
- Path parameters (userId, roomId, problemId, etc.)
- Query parameters (limit, offset, search, filters)
- Header parameters (authorization)

### `endpoints/`
Contains endpoint definitions organized by feature area:

#### `auth.js`
- POST /auth/login
- POST /auth/register  
- POST /auth/reset-password
- POST /auth/reset-password/confirm
- POST /auth/logout
- POST /auth/refresh-token

#### `users.js`
- GET /users/profile
- PUT /users/profile
- PUT /users/change-email
- PUT /users/change-password
- PUT /users/deactivate
- POST /users/upload-profile-image

#### `rooms.js`
- POST /rooms/upload-banner
- GET /rooms
- POST /rooms
- GET /rooms/id/{id}
- PUT /rooms/id/{id}
- DELETE /rooms/id/{id}
- GET /rooms/admin/code/{code}
- GET /rooms/user/code/{code}
- PUT /rooms/change-visibility

#### `participants.js`
- POST /participants/join
- POST /participants/invite
- DELETE /participants/leave/{room_id}
- DELETE /participants/room/{room_id}/participant/{user_id}
- GET /participants/status/{room_id}
- GET /participants/count/{room_id}
- GET /participants/creator/lists/{room_id}
- GET /participants/user/lists/{room_id}
- GET /participants/joined

#### `problems.js`
- POST /problems
- GET /problems/room-code/{room_code}
- PUT /problems/update-timer/{problem_id}
- GET /problems/compe-problems/{competition_id}
- GET /problems/{room_id}
- GET /problems/{problem_id}
- PUT /problems/{problem_id}
- DELETE /problems/{problem_id}
- POST /problems/{problem_id}/{competition_id}
- DELETE /problems/{problem_id}/{competition_id}
- GET /problems/compe-problem/{compe_prob_id}

#### `competitions.js`
- POST /competitions
- GET /competitions/{room_id}
- GET /competitions/{room_id}/{compe_id}
- POST /competitions/{compe_id}/start
- PATCH /competitions/{compe_id}/next
- PATCH /competitions/{compe_id}/pause
- PATCH /competitions/{compe_id}/resume
- POST /competitions/{compe_id}/auto-advance

#### `attempts.js`
- POST /attempts/submit

#### `leaderboards.js`
- GET /leaderboard/room/{room_id}
- GET /leaderboard/competition/{room_id}

## Adding New Endpoints

1. **Create new endpoint file** (if needed):
   ```javascript
   // endpoints/problems.js
   module.exports = {
     "/problems": {
       get: {
         tags: ["Problems"],
         summary: "Get all problems",
         // ... endpoint definition
       }
     }
   };
   ```

2. **Import in main swagger.js**:
   ```javascript
   const problemEndpoints = require('./swagger/endpoints/problems');
   
   const allPaths = {
     ...authEndpoints,
     ...userEndpoints,
     ...roomEndpoints,
     ...problemEndpoints  // Add here
   };
   ```

3. **Add new schemas** (if needed):
   Add to `schemas.js` and they'll be automatically available.

4. **Add new request bodies** (if needed):
   Add to `requestBodies.js` using camelCase naming.

5. **Add new parameters** (if needed):
   Add to `parameters.js` using camelCase naming.

## Benefits of This Structure

1. **Maintainability**: Each feature has its own file, making it easy to find and update specific endpoints.

2. **Reusability**: Common schemas, parameters, and request bodies are defined once and reused.

3. **Scalability**: Easy to add new features without cluttering the main configuration.

4. **Team Collaboration**: Multiple developers can work on different endpoint files without conflicts.

5. **Organization**: Clear separation of concerns with logical grouping.

## Usage

The modular structure is automatically combined in the main `swagger.js` file. The Swagger UI will display all endpoints as if they were in a single file, but development is much more organized.

Access the documentation at: `http://localhost:5000/api/docs`

## Example: Adding a New Feature

To add competition endpoints:

1. Create `endpoints/competitions.js`
2. Define competition-related endpoints
3. Import in main `swagger.js`
4. Add any new schemas to `schemas.js`
5. Add request bodies to `requestBodies.js`

The system automatically handles the proper formatting and references between components.