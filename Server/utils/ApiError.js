class ApiError extends Error{
    constructor(statusCode, message="Failed", success = false){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.success = success;
        this.data = null;
    }
}

export default ApiError