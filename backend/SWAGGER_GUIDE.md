# 📚 Easy Swagger Endpoint Guide

## 🚀 How to Add New Endpoints (Super Easy!)

### 1. **Add Request Body Template** (if needed)
```javascript
// In requestBodies object, add:
newEndpoint: {
  required: true,
  content: {
    'application/json': {
      schema: {
        type: 'object',
        required: ['field1', 'field2'],
        properties: {
          field1: { type: 'string', example: 'example value' },
          field2: { type: 'integer', example: 123 }
        }
      }
    }
  }
}
```

### 2. **Add Path Parameter** (if needed)
```javascript
// In pathParams object, add:
newParam: { name: 'newParam', in: 'path', required: true, schema: { type: 'string' } }
```

### 3. **Add Your Endpoint**
```javascript
// In paths object, add:
'/your/new/endpoint': createEndpoint('post', 'Your endpoint description', 'YourTag', {
  auth: true, // if requires authentication
  requestBody: requestBodies.newEndpoint, // if has request body
  parameters: [pathParams.newParam], // if has path parameters
  responses: {
    200: { description: 'Success message' },
    400: { description: 'Error message' }
  }
})
```

## 🔧 Common Examples:

### Simple GET endpoint (no auth needed):
```javascript
'/public/info': createEndpoint('get', 'Get public information', 'Public')
```

### POST with auth and request body:
```javascript
'/users/update': createEndpoint('post', 'Update user info', 'Users', {
  auth: true,
  requestBody: requestBodies.updateUser
})
```

### GET with path parameter:
```javascript
'/posts/{id}': createEndpoint('get', 'Get post by ID', 'Posts', {
  auth: true,
  parameters: [pathParams.id]
})
```

### Multiple methods on same path:
```javascript
'/items': {
  ...createEndpoint('get', 'Get all items', 'Items', { auth: true }),
  ...createEndpoint('post', 'Create new item', 'Items', { auth: true, requestBody: requestBodies.createItem })
}
```

## 📝 Quick Checklist:
- ✅ Add request body template (if needed)
- ✅ Add path parameters (if needed)  
- ✅ Add endpoint to paths object
- ✅ Test in Swagger UI at `/api-docs`

That's it! Super clean and easy to maintain! 🎯