import { userService } from "../services/user-service.js";
import { validationResult } from 'express-validator';
import { ApiError } from "../exceptions/api-error.js";
import { setRefreshTokenCookie } from "../utils/set-cookie.js";

class UserController {
  async registration(req, res, next) {
    try {
      const validationErrors = validationResult(req);
      if (!validationErrors.isEmpty()) {
        return next(ApiError.BadRequest(" Validation errors", validationErrors.array()));
      };
      const { name, email, password } = req.body;
      const userData = await userService.registration(name, email, password);
      setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const userData = await userService.login(email, password);
      setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const { id } = req.body;
      const token = await userService.logout(refreshToken, id);
      res.clearCookie('refreshToken');
      res.json(token);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.updateRefreshToken(refreshToken);
      setRefreshTokenCookie(res, userData.refreshToken);
      return res.json(userData);
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      return res.json(users);
    } catch (e) {
      next(e);
    }
  }

  async deleteUser(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.deleteUser(id);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }

  async blockAndUnblockUser(req, res, next) {
    try {
      const { id } = req.params;
      const { access } = req.body;
      const user = await userService.blockAndUnblockUser(id, access);
      return res.json(user);
    } catch (e) {
      next(e);
    }
  }
}

export const userController = new UserController();