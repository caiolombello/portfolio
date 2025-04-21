import { describe, test, expect } from "vitest";
import { z } from "zod";
import {
  ContentError,
  FileNotFoundError,
  DirectoryNotFoundError,
  FileReadError,
  JsonParseError,
  ValidationError,
  formatValidationErrors,
  handleFsError,
  handleJsonError,
  handleValidationError,
} from "../lib/errors";

describe("Error Classes", () => {
  test("ContentError has correct name and message", () => {
    const error = new ContentError("test message");
    expect(error.name).toBe("ContentError");
    expect(error.message).toBe("test message");
  });

  test("FileNotFoundError formats message correctly", () => {
    const error = new FileNotFoundError("/path/to/file.json");
    expect(error.name).toBe("FileNotFoundError");
    expect(error.message).toBe("File not found: /path/to/file.json");
  });

  test("DirectoryNotFoundError formats message correctly", () => {
    const error = new DirectoryNotFoundError("/path/to/dir");
    expect(error.name).toBe("DirectoryNotFoundError");
    expect(error.message).toBe("Directory not found: /path/to/dir");
  });

  test("FileReadError formats message with Error cause", () => {
    const cause = new Error("read permission denied");
    const error = new FileReadError("/path/to/file.json", cause);
    expect(error.name).toBe("FileReadError");
    expect(error.message).toBe(
      "Error reading file /path/to/file.json: read permission denied",
    );
  });

  test("FileReadError formats message with non-Error cause", () => {
    const error = new FileReadError("/path/to/file.json", "unknown error");
    expect(error.name).toBe("FileReadError");
    expect(error.message).toBe(
      "Error reading file /path/to/file.json: unknown error",
    );
  });

  test("JsonParseError formats message correctly", () => {
    const cause = new SyntaxError("Unexpected token");
    const error = new JsonParseError("/path/to/file.json", cause);
    expect(error.name).toBe("JsonParseError");
    expect(error.message).toBe(
      "Error parsing JSON from /path/to/file.json: Unexpected token",
    );
  });

  test("ValidationError includes ZodError details", () => {
    const zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["name"],
        message: "Expected string, received number",
      },
    ]);
    const error = new ValidationError("Validation failed", zodError);
    expect(error.name).toBe("ValidationError");
    expect(error.message).toBe("Validation failed");
    expect(error.errors).toBe(zodError);
  });
});

describe("Error Utilities", () => {
  test("formatValidationErrors formats ZodError correctly", () => {
    const zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["user", "name"],
        message: "Expected string, received number",
      },
      {
        code: "invalid_type",
        expected: "string",
        received: "undefined",
        path: ["user", "email"],
        message: "Required",
      },
    ]);
    const formatted = formatValidationErrors(zodError);
    expect(formatted).toBe(
      "user.name: Expected string, received number\nuser.email: Required",
    );
  });

  test("handleFsError throws FileNotFoundError for ENOENT", () => {
    const error = { code: "ENOENT" } as NodeJS.ErrnoException;
    expect(() => handleFsError(error, "/path/to/file")).toThrow(
      FileNotFoundError,
    );
    expect(() => handleFsError(error, "/path/to/file")).toThrow(
      "File not found: /path/to/file",
    );
  });

  test("handleFsError throws FileReadError for other errors", () => {
    const error = new Error("Permission denied");
    expect(() => handleFsError(error, "/path/to/file")).toThrow(FileReadError);
    expect(() => handleFsError(error, "/path/to/file")).toThrow(
      "Error reading file /path/to/file: Permission denied",
    );
  });

  test("handleJsonError throws JsonParseError", () => {
    const error = new SyntaxError("Unexpected token");
    expect(() => handleJsonError(error, "/path/to/file")).toThrow(
      JsonParseError,
    );
    expect(() => handleJsonError(error, "/path/to/file")).toThrow(
      "Error parsing JSON from /path/to/file: Unexpected token",
    );
  });

  test("handleValidationError throws ValidationError with formatted message", () => {
    const zodError = new z.ZodError([
      {
        code: "invalid_type",
        expected: "string",
        received: "number",
        path: ["name"],
        message: "Expected string, received number",
      },
    ]);
    expect(() => handleValidationError(zodError, "User")).toThrow(
      ValidationError,
    );
    expect(() => handleValidationError(zodError, "User")).toThrow(
      "Validation failed for User:\nname: Expected string, received number",
    );
  });
});
