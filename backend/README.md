# JSDoc-Based Swagger Documentation

## 🎯 **Overview**
This project now uses **JSDoc comments** directly in route files for API documentation. This approach is much easier to maintain than separate swagger files.

## 📝 **How It Works**

### Adding Documentation to Routes
When you create a new endpoint, add JSDoc comments directly above the route:

```javascript
/**
 * @swagger
 * /your-endpoint:
 *   post:
 *     tags: [YourTag]
 *     summary: Brief description
 *     description: Detailed description
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [field1, field2]
 *             properties:
 *               field1: { type: string, example: "example value" }
 *               field2: { type: number, example: 123 }
 *     responses:
 *       200:
 *         description: Success response
 *       400:
 *         $ref: '#/components/responses/BadRequestError'
 */
router.post('/your-endpoint', controller.method);
```

## 🔧 **Configuration**

The main swagger configuration is in `config/swagger.js`:
- Scans all route files in `presentation/routes/*.js`
- Provides basic components (Error schemas, responses)
- Includes authentication scheme for Supabase

## 🚀 **Benefits**

- ✅ **Single Location**: Route definition + documentation together
- ✅ **Auto-Discovery**: New routes automatically included
- ✅ **Less Maintenance**: No separate files to manage
- ✅ **Postman Ready**: Still generates `/docs.json` for import
- ✅ **Live Documentation**: Available at `/api-docs`

## 📊 **Current Status**

- **Total Endpoints**: 45 documented endpoints
- **Coverage**: All 8 route files fully documented
- **Features**: Complete request/response examples for Postman import

## 🛠 **Usage**

1. **View Documentation**: `http://localhost:5000/api-docs`
2. **Postman Import**: `http://localhost:5000/docs.json`
3. **Add New Endpoint**: Add JSDoc comment above route definition

## 🎯 **Tags Used**

- Authentication
- Users  
- Rooms
- Participants
- Problems
- Competitions
- Attempts
- Leaderboards

This approach makes API documentation maintenance much simpler while preserving all the benefits for Postman integration! 🎉