import { ZodError } from "zod";

/**
 * Base error class for content-related errors
 */
export class ContentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentError";
  }
}

/**
 * Error thrown when a file is not found
 */
export class FileNotFoundError extends ContentError {
  constructor(filePath: string) {
    super(`File not found: ${filePath}`);
    this.name = "FileNotFoundError";
  }
}

/**
 * Error thrown when a directory is not found
 */
export class DirectoryNotFoundError extends ContentError {
  constructor(dirPath: string) {
    super(`Directory not found: ${dirPath}`);
    this.name = "DirectoryNotFoundError";
  }
}

/**
 * Error thrown when there's an issue reading a file
 */
export class FileReadError extends ContentError {
  constructor(filePath: string, cause: unknown) {
    super(
      `Error reading file ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
    this.name = "FileReadError";
  }
}

/**
 * Error thrown when JSON parsing fails
 */
export class JsonParseError extends ContentError {
  constructor(filePath: string, cause: unknown) {
    super(
      `Error parsing JSON from ${filePath}: ${cause instanceof Error ? cause.message : String(cause)}`,
    );
    this.name = "JsonParseError";
  }
}

/**
 * Error thrown when data validation fails
 */
export class ValidationError extends ContentError {
  constructor(
    message: string,
    public errors: ZodError,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Helper function to format validation errors
 */
export function formatValidationErrors(error: ZodError): string {
  return error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join("\n");
}

/**
 * Helper function to handle file system errors
 */
export function handleFsError(error: unknown, path: string): never {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") {
    throw new FileNotFoundError(path);
  }
  throw new FileReadError(path, error);
}

/**
 * Helper function to handle JSON parse errors
 */
export function handleJsonError(error: unknown, path: string): never {
  throw new JsonParseError(path, error);
}

/**
 * Helper function to handle validation errors
 */
export function handleValidationError(error: ZodError, context: string): never {
  throw new ValidationError(
    `Validation failed for ${context}:\n${formatValidationErrors(error)}`,
    error,
  );
}

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;

  constructor(
    message: string,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

export function handleError(error: unknown): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message);
  }

  return new AppError("An unexpected error occurred");
}
