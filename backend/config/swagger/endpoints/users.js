// User management endpoints - Complete set based on UserRoutes.js
module.exports = {
  "/users/profile": {
    get: {
      tags: ["Users"],
      summary: "Get user profile",
      description: "Get the authenticated user's profile information",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "User profile retrieved successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    },
    put: {
      tags: ["Users"],
      summary: "Update user profile",
      description: "Update the authenticated user's profile information",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/UpdateProfile" },
      responses: {
        200: {
          description: "User profile updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: { $ref: "#/components/schemas/User" },
                      message: { type: "string", example: "Profile updated successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/users/change-email": {
    put: {
      tags: ["Users"],
      summary: "Update user email",
      description: "Change the authenticated user's email address",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/ChangeEmail" },
      responses: {
        200: {
          description: "Email updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Email updated successfully" },
                      data: { $ref: "#/components/schemas/User" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" },
        409: {
          description: "Email already exists",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Email already exists" }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  },

  "/users/change-password": {
    put: {
      tags: ["Users"],
      summary: "Update user password",
      description: "Change the authenticated user's password",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/ChangePassword" },
      responses: {
        200: {
          description: "Password updated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Password updated successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/users/deactivate": {
    put: {
      tags: ["Users"],
      summary: "Deactivate user account",
      description: "Deactivate the authenticated user's account",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Account deactivated successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Account deactivated successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/users/upload-profile-image": {
    post: {
      tags: ["Users"],
      summary: "Upload profile image",
      description: "Upload and set user profile image",
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'multipart/form-data': {
            schema: {
              type: 'object',
              properties: {
                profileImage: {
                  type: 'string',
                  format: 'binary',
                  description: 'Profile image file (JPEG, PNG, max 5MB)'
                }
              },
              required: ['profileImage']
            }
          }
        }
      },
      responses: {
        200: {
          description: "Profile image uploaded successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Profile image uploaded successfully" },
                      data: {
                        type: "object",
                        properties: {
                          imageUrl: { type: "string", example: "https://example.com/profile/user123.jpg" }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        401: { $ref: "#/components/responses/UnauthorizedError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  }
};