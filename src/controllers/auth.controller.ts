import { NextFunction, Request, Response } from "express";
import { User } from "../entity/user.entity";
import { RefreshToken } from "../entity/refreshToken.entity";
import { BaseController } from "./base.controller";
import * as bcrypt from "bcryptjs";
import Env from "../services/Env";
import { sign, Secret, JwtPayload } from "jsonwebtoken";
import { ConnectionIsNotSetError, SimpleConsoleLogger } from "typeorm";
import { AppDataSource } from "../data-source";
import { AuthRequest } from "../inferfaces";
import { getRepository } from "typeorm";
// import { v4 as uuidv4 } from 'uuid';

export class AuthController extends BaseController {
    // {
    //   "username": "username",
    //   "password": "P@ssw0rd",
    //   "firstName": "firstName",
    //   "lastName": "lastName"
    // }
    public signup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = { ...req.body };
            if (!req.body.username || !req.body.password) {
                return this.error(res, new Error("username , password is required"));
            }
            // //check username duplicate
            const checkusername = await User.findOneBy({ username: body.username });
            if (checkusername) return this.error(res, new Error("username duplicate"), 409);

            // //save user to DB
            const newUser = await User.create({
                ...req.body,
                password: bcrypt.hashSync(req.body.password, 8),
            }).save();

            return this.ok(res, { ...newUser, password: undefined }, 201);
        } catch (error) {
            return this.error(res, error);
        }
    };

    public signin = async (req: Request, res: Response) => {
        try {
            // console.log(req.headers['x-forwarded-for'] || req.socket.remoteAddress)
            const body = { ...req.body };

            if (!req.body.username || !req.body.password) {
                return this.error(res, new Error("username , password is required"));
            }
            const user = await User.createQueryBuilder()
                .addSelect("User.password")
                .where({ username: body.username })
                .getOne();

            if (!user) {
                return this.error(res, new Error("user not found"));
            }

            const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
            if (!passwordIsValid) {
                return this.error(res, new Error("invalid Password"));
            }
            const token = await this.generateToken(user);

            return this.ok(res, {
                user: {
                    ...user,
                    password: undefined,
                },
                token,
            });
        } catch (error) {
            return this.error(res, error);
        }
    };

    public refreshToken = async (req: Request, res: Response) => {
        try {
            const body = req.body;
            if (!body.refreshToken) {
                return this.error(res, new Error("refreshToken is required"));
            }
            // check refreshtoken has in database
            const oldRefreshToken = await RefreshToken.findOne({
                where: {
                    token: body.refreshToken,
                    revoke: false,
                },
                relations: ["user"],
            });
            if (!oldRefreshToken) {
                return this.error(res, new Error("refreshToken not found in database"));
            }
            // refreshtoken expired check
            if (oldRefreshToken.expiryDate.getTime() < new Date().getTime()) {
                await oldRefreshToken.remove();
                return this.error(res, new Error("refresh token was expired"));
            }
            if (oldRefreshToken.user) {
                this.ok(res, await this.generateToken(oldRefreshToken.user, oldRefreshToken.token));
            } else {
                this.error(res, new Error("refresh token not found user"));
            }
        } catch (error) {
            return this.error(res, error);
        }
    };

    public logout = async (req: AuthRequest, res: Response) => {
        console.log(req.auth);
        this.ok(res);
    };

    private async generateToken(user: User, oldRefreshToken: string = "") {
        try {
            if (!user) {
                return {};
            }
            const accessToken = sign({ id: user.id }, this.env.JWT_SECRET, {
                expiresIn: Env.JWT_EXPIRES,
            });

            let token = { accessToken, refreshToken: "" };
            if (oldRefreshToken) {
                token.refreshToken = oldRefreshToken;
            } else {
                let expiredAt = new Date();
                expiredAt.setSeconds(expiredAt.getSeconds() + this.env.JWT_REFRESH_EXPIRES);
                const refreshToken = await RefreshToken.create({
                    expiryDate: expiredAt,
                    userId: user.id,
                }).save();
                token.refreshToken = refreshToken.token;
            }
            return token;
        } catch (error) {
            throw error;
        }
    }
}
