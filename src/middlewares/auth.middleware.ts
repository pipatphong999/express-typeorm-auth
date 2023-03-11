import { verify, TokenExpiredError } from "jsonwebtoken";
import { BaseController } from "../controllers/base.controller";
import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../inferfaces";
import { SimpleConsoleLogger } from "typeorm";
import { User } from "../entity/user.entity";

export class AuthMiddleWare extends BaseController {
    public verifyToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
        try {
            let { authorization: token } = req.headers;
            token = token?.split(" ")?.[1];
            if (!token) {
                return this.error(res, new Error("No token provided!"), 403);
            }
            await verify(`${token}`, this.env.JWT_SECRET, async (err: any, decoded: any) => {
                if (err) {
                    if (err instanceof TokenExpiredError) {
                        return this.error(
                            res,
                            new Error("Unauthorized! Access Token was expired!"),
                            401
                        );
                    } else {
                        return this.error(res, err);
                    }
                }

                const user = await User.findOneBy({ id: decoded.id });
                if (!user) {
                    return this.error(res, new Error("user not found."), 404);
                }
                req.auth = { ...user };
                next();
            });
        } catch (error) {
            this.error(res, error);
        }
    };
}
