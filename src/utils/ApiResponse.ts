class ApiResponse {
    statusCode: number
    data: any
    message: string
    success: boolean

    /**
     * Constructor for ApiError Class.
     *
     * @param {number} statusCode - the status code
     * @param {any} data - the data
     * @param {string} message - the message
     */
    constructor( statusCode:number, data:any, message:string ){
        
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = true
    }
}

export default ApiResponse