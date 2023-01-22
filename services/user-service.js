import { UserModel } from '../models/user-model.js';
import { v4 as uuidv4 } from 'uuid';
// import { mailService } from './mail-service.js';
import { UserDto } from '../dtos/user-dto.js';
import { ApiError } from '../exceptions/api-error.js';
import { getDate } from '../utils/getDate.js';
import { comparePassword, getHashPassword } from '../utils/hash.js';
import { getTokens } from '../utils/token.js';
import { tokenService } from './token-service.js';
import { TokenModel } from '../models/token-model.js';

class UserService {
  async registration(name, email, password) {
    const candidate = await UserModel.findOne({ email });
    if (candidate) {
      throw ApiError.BadRequest(`User with email ${email} address exists`);
    }
    const activationLink = uuidv4();
    const passwordHash = await getHashPassword(password);
    const user = await UserModel.create(
      {
        name,
        email,
        password: passwordHash,
        activationLink,
        registrationDate: getDate(),
        status: 'active',
        lastLoginDate: getDate('login',)
      });
    const userDto = new UserDto(user);
    return {
      ...getTokens(userDto),
      user: userDto
    };
  };

  async login(email, password) {
    const user = await UserModel.findOne({ email });
    const isPasswordEquals = await comparePassword(password, user.password);
    if (!isPasswordEquals) {
      throw ApiError.BadRequest("Wrong password");
    }
    await user.updateOne({ $set: { lastLoginDate: getDate('login'), status: 'active' } });
    const userDto = new UserDto(user);
    return {
      ...getTokens(userDto),
      user: userDto
    };
  }

  async logout(refreshToken, id) {
    const token = await tokenService.removeToken(refreshToken);
    await UserModel.updateOne({ _id: id }, { $set: { status: 'inactive' } });
    return token;
  }

  async updateRefreshToken(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData = tokenService.validateRefreshToken(refreshToken);
    const tokenFromDb = await tokenService.findToken(refreshToken);
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError();
    }
    const user = await UserModel.findById(userData.id);
    const userDto = new UserDto(user);
   
    return {
      ...getTokens(userDto),
      user: userDto
    };
  }

  async getAllUsers() {
    return await UserModel.find();
  }

  async deleteUser(id) {
    await TokenModel.deleteOne({ user: id });
    return await UserModel.deleteOne({ _id: id });
  }

  async blockAndUnblockUser(id, access) {
    if (access === 'blocked') {
      const tt = await UserModel.updateOne({ _id: id }, { $set: { status: 'inactive' } });
    }
    return await UserModel.updateOne({ _id: id }, { $set: { access } });
  }
}

export const userService = new UserService();