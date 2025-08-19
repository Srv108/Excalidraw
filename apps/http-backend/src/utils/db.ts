import { prisma } from "@repo/db/client";

export class PrismaErrorHandler extends Error {
    constructor(error: unknown){
        let message = "Unknown Error";

        if(error instanceof prisma.PrismaClientKnownRequestError){

            switch(error.code){
                case "P2002":
                    message = "A user with same email already exist"
                    break;
                case "P2003":
                    message = `Foreign key constraint failed on field: ${error.meta?.field_name}`
                    break;
                case "P2025":
                    message = `Record not found: ${error.meta?.cause || "No matching record."}`
                    break;
                default:
                    message = `prisma known request error [${error.code}]: ${error.message}`
                    break;
            }
        }else if (error instanceof prisma.PrismaClientValidationError) {
            // Invalid data sent to prisma
            message = "Validation error: The data provided does not match the schema."
        }else if (error instanceof prisma.PrismaClientInitializationError) {
            // DB connection / env issues
            message = `Initialization error: ${error.message}`
        }else if (error instanceof prisma.PrismaClientRustPanicError) {
            // prisma internal panic (rare)
            message = "prisma internal error: The query engine panicked."
        } else {
            message = "Unknown Error";
        }

        super(message);
        this.name = "PrismaErrorHandler";
    }
};

export function isPrismaError(error: unknown): boolean {
    return (
        error instanceof prisma.PrismaClientKnownRequestError ||
        error instanceof prisma.PrismaClientValidationError ||
        error instanceof prisma.PrismaClientInitializationError ||
        error instanceof prisma.PrismaClientRustPanicError
    );
}
