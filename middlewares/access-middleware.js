import { ApiError } from "../exceptions/api-error.js";
import { UserModel } from "../models/user-model.js";

export async function accessMiddleware(req, res, next) {
  try {
    const { id } = req.params;
    const user = await UserModel.findOne({ _id: id });
    if (user.access === false && user.status === "active") {
        await UserModel.updateOne({ _id: id}, { $set: { status: 'inactive' } });
        return next(ApiError.Forbidden());
      }
    next();
  } catch (e) {
    return next(ApiError.Forbidden());
  }
}