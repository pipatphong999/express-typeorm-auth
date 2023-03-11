import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/user.entity";
import { RefreshToken } from "./entity/refreshToken.entity";
import { AccessToken } from "./entity/accessToken.entity";
import Env from "./services/Env";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: Env.DB_HOST,
    port: Env.DB_PORT,
    username: Env.DB_USERNAME,
    password: Env.DB_PASSWORD,
    database: Env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [User, RefreshToken, AccessToken],
    migrations: [],
    subscribers: [],
});
