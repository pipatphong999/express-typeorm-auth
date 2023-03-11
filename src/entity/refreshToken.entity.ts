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

@Entity("refresh_token")
export class RefreshToken extends BaseEntity {
    @PrimaryGeneratedColumn("uuid", { name: "token" })
    token: string;

    @Column({ name: "expiry_date" })
    expiryDate: Date;

    @Column({ name: "user_id" })
    userId: string;

    @Column({ name: "revoke", default: 0 })
    revoke: Boolean;

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;

    @ManyToOne((type) => User, (user: User) => user.id)
    @JoinColumn({ name: "user_id" })
    user: User;
}
