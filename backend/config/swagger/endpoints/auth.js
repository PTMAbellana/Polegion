// Authentication endpoints - Complete set based on AuthRoutes.js
module.exports = {
  "/auth/login": {
    post: {
      tags: ["Authentication"],
      summary: "User login with Supabase",
      description: "Authenticate a user with email and password using Supabase",
      requestBody: { $ref: "#/components/requestBodies/Login" },
      responses: {
        200: {
          description: "Login successful",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                          refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
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
  },

  "/auth/register": {
    post: {
      tags: ["Authentication"],
      summary: "User registration with Supabase",
      description: "Create a new user account using Supabase authentication",
      requestBody: { $ref: "#/components/requestBodies/Register" },
      responses: {
        201: {
          description: "Registration successful",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          user: { $ref: "#/components/schemas/User" },
                          access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                          refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
                        }
                      }
                    }
                  }
                ]
              }
            }
          }
        },
        409: {
          description: "User already exists",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "User with this email already exists" }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/auth/reset-password": {
    post: {
      tags: ["Authentication"],
      summary: "Request password reset",
      description: "Send password reset email to user",
      requestBody: { $ref: "#/components/requestBodies/ResetPassword" },
      responses: {
        200: {
          description: "Password reset email sent",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Password reset email sent successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        404: { $ref: "#/components/responses/NotFoundError" },
        400: { $ref: "#/components/responses/BadRequestError" }
      }
    }
  },

  "/auth/reset-password/confirm": {
    post: {
      tags: ["Authentication"],
      summary: "Confirm password reset",
      description: "Confirm password reset with token and new password",
      requestBody: { $ref: "#/components/requestBodies/ResetPasswordConfirm" },
      responses: {
        200: {
          description: "Password reset successful",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Password reset successfully" }
                    }
                  }
                ]
              }
            }
          }
        },
        400: { $ref: "#/components/responses/BadRequestError" },
        401: { $ref: "#/components/responses/UnauthorizedError" }
      }
    }
  },

  "/auth/logout": {
    post: {
      tags: ["Authentication"],
      summary: "User logout",
      description: "Logout user and invalidate Supabase session",
      security: [{ bearerAuth: [] }],
      responses: {
        200: {
          description: "Logout successful",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Logged out successfully" }
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

  "/auth/refresh-token": {
    post: {
      tags: ["Authentication"],
      summary: "Refresh Supabase session token",
      description: "Get a new access token using Supabase refresh token",
      requestBody: { $ref: "#/components/requestBodies/RefreshToken" },
      responses: {
        200: {
          description: "Token refreshed successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      data: {
                        type: "object",
                        properties: {
                          access_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
                          refresh_token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." }
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