import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    Generated,
    Column,
    BaseEntity,
    PrimaryColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { User } from "./user.entity";
import { AppDataSource } from "../data-source";

@Entity("RefreshTokens")
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    token: string;

    @Column()
    expiryDate: Date;

    @Column()
    userId: string;

    @Column({ default: false })
    revoke: Boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne((type) => User, (user: User) => user.id)
    user: User;
}
