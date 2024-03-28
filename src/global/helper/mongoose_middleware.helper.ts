export class MongooseMiddlewareHelper {
    static setupMappingMiddlewares(schema: any): void {
        schema.post("save", MongooseMiddlewareHelper.handleMiddleWare);
        schema.post("init", MongooseMiddlewareHelper.handleMiddleWare);
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
