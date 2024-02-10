class ApiError extends Error{
    statusCode: number;
    success: boolean;
    errors: any[];
    data: any;
    /**
     * Constructor for ApiError Class.
     *
     * @param {number} statusCode - the status code
     * @param {string} message - the error message (default: "Something went wrong")
     * @param {any[]} errors - an array of errors (default: [])
     * @param {string} stack - the stack trace (default: "")
     */
    constructor(
        statusCode: number ,
        message:string = "Something went wrong",
        errors :any[]= [],
        stack:string = ""
    ){
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false
        this.errors = errors;
        
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export default ApiError