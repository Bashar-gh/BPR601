import { Types } from 'mongoose';

 declare global {
  interface String {
    toObjectID(): Types.ObjectId;
  }
}

String.prototype.toObjectID = function (): Types.ObjectId {
  return new Types.ObjectId(this);
};
