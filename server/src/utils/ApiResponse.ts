

class ApiResponse {
    public success:boolean;

    constructor (
        public statusCode:number,
        public data:any,
        public message:string = "Success Request"
    ){
        this.statusCode = statusCode;
        this.data = data
        this.message = message;
        this.success = statusCode <400
    }
}


export default ApiResponse;