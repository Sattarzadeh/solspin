import { CustomError } from "./CustomError"

export class CaseDoesNotExistError extends CustomError {
    public statusCode: number;
    constructor(caseName: string) {
        super(`Case with name ${caseName} not found`)
        this.name = 'CaseNotFoundError'
        this.statusCode = 404
    }

    serializeErrors() {
        return [{ message: this.message }];
    }
}