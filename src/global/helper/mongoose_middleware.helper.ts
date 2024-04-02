export class MongooseMiddlewareHelper {
    static setupMappingMiddlewares(schema: any): void {
        schema.post("save", MongooseMiddlewareHelper.handleMiddleWare);
        schema.post("init", MongooseMiddlewareHelper.handleMiddleWare);
    }
    static setupMappingMiddlewaresDate(schema: any): void {
        schema.post("save", MongooseMiddlewareHelper.handleMiddleWareDate);
        schema.post("init", MongooseMiddlewareHelper.handleMiddleWareDate);
    }
    static handleMiddleWareDate(this: any, doc: any, next: Function): void {
        if (doc._id) {
            doc.date = doc.createdAt;
        }
        if (this._id) {
            this.date = this.createdAt;
        }
        if (next) {
            next();
        }
    }

    static handleMiddleWare(this: any, doc: any, next: Function): void {
        if (doc._id) {
            doc.id = doc._id;
        }
        if (this._id) {
            this.id = this._id;
        }
        if (next) {
            next();
        }
    }
}
