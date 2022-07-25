
class MiddlewareError extends Error {

    private data: any;
    private status: number;

    constructor(message: string, status: number, data: any) {
        super(message);
        Error.captureStackTrace(this, this.constructor);
        this.name = this.constructor.name;
        this.status = status;
        this.data = data;
    }

    public getStatusCode(): number {
        return this.status;
    }

    public getData(): any {
        return this.data;
    }

}

export default MiddlewareError;