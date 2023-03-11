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
@Entity("users")
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "id" })
    id: string;

    @Column({ name: "first_name" })
    firstName: string;

    @Column({ name: "last_name" })
    lastName: string;

    @Column({ unique: true, name: "username" })
    username: string;

    @Column({ unique: true, nullable: true, name: "email" })
    email: string;

    @Column({ name: "password", select: false })
    password: string;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @DeleteDateColumn({ name: "deleted_at" })
    deletedAt: Date;

    // @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.userId)
    // refreshTokens: RefreshToken[];

    // @OneToMany(() => Photo, (photo) => photo.user)
    // photos: Photo[]

    // @OneToMany(() =>refreshToken )
    // refreshToken: refreshToken
}
