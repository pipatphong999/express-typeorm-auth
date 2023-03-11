import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    Column,
    BaseEntity,
    OneToMany,
} from "typeorm";
import { AppDataSource } from "../data-source";
import { RefreshToken } from "./refreshToken.entity";
@Entity("Users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ select: false })
    password: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @OneToMany((type) => RefreshToken, (refreshToken) => refreshToken.userId)
    refreshTokens: RefreshToken[];

    // @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.userId)
    // refreshTokens: RefreshToken[];

    // @OneToMany(() => Photo, (photo) => photo.user)
    // photos: Photo[]

    // @OneToMany(() =>refreshToken )
    // refreshToken: refreshToken
}
