
export default class CustomError extends Error {
   
    constructor(
        public message: string,
        public status: number,
        public code: number,
    ) {
        super(message);
        this.date = new Date().toISOString();
        
    }
    date:string;
}