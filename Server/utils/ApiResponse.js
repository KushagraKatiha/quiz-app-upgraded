class ApiResponse{
    constructor(statusCode, message="Success", success = true, data = null){
        this.statusCode = statusCode, 
        this.message = message,
        this.success = success,
        this.data = data
    }
}

export default ApiResponse