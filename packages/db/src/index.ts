import { PrismaClient, Prisma } from "@prisma/client";

export const client = new PrismaClient();

export class PrismaErrorHandler extends Error {
    constructor(error: unknown) {
        let message = "Unknown Error";

        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            switch (error.code) {
                case "P2002":
                    message = "A user with same email already exists";
                    break;
                case "P2003":
                    message = `Foreign key constraint failed on field: ${error.meta?.field_name}`;
                    break;
                case "P2025":
                    message = `Record not found: ${error.meta?.cause || "No matching record."}`;
                    break;
                default:
                    message = `Prisma known request error [${error.code}]: ${error.message}`;
                    break;
            }
        } else if (error instanceof Prisma.PrismaClientValidationError) {
            message = "Validation error: The data provided does not match the schema.";
        } else if (error instanceof Prisma.PrismaClientInitializationError) {
            message = `Initialization error: ${error.message}`;
        } else if (error instanceof Prisma.PrismaClientRustPanicError) {
            message = "Prisma internal error: The query engine panicked.";
        }

        super(message);
        this.name = "PrismaErrorHandler";
    }
}

export function isPrismaError(error: unknown): boolean {
    return (
        error instanceof Prisma.PrismaClientKnownRequestError ||
        error instanceof Prisma.PrismaClientValidationError ||
        error instanceof Prisma.PrismaClientInitializationError ||
        error instanceof Prisma.PrismaClientRustPanicError
    );
}
