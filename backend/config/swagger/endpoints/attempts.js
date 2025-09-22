// Attempts management endpoints - Complete set based on AttemptsRoutes.js
module.exports = {
  "/attempts/submit": {
    post: {
      tags: ["Attempts"],
      summary: "Submit programming solution",
      description: "Submit a programming solution for evaluation",
      security: [{ bearerAuth: [] }],
      requestBody: { $ref: "#/components/requestBodies/SubmitSolution" },
      responses: {
        201: {
          description: "Solution submitted successfully",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Success" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Solution submitted successfully" },
                      data: {
                        type: "object",
                        properties: {
                          attempt: { $ref: "#/components/schemas/Attempt" },
                          submissionId: { type: "string", example: "submission-uuid-123" },
                          status: { type: "string", example: "PENDING" }
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
        400: { $ref: "#/components/responses/BadRequestError" },
        404: {
          description: "Problem or competition not found",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Problem or competition not found" }
                    }
                  }
                ]
              }
            }
          }
        },
        429: {
          description: "Submission rate limit exceeded",
          content: {
            "application/json": {
              schema: {
                allOf: [
                  { $ref: "#/components/schemas/Error" },
                  {
                    type: "object",
                    properties: {
                      message: { type: "string", example: "Submission rate limit exceeded. Please wait before submitting again." }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    }
  }
};