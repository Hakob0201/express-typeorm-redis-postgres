import crypto from 'crypto';
import {Entity, Column, Index, JoinTable, BeforeInsert, ManyToMany, PrimaryGeneratedColumn} from 'typeorm';
import bcrypt from 'bcryptjs';
import Model from './model.entity';
import { Organization } from "./organization.entity";

export enum RoleEnumType {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User extends Model {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Index('email_index')
    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.USER,
    })
    role: RoleEnumType.USER;

    @Column({
        default: 'default.png',
    })
    photo: string;

    @Column({
        default: false,
    })
    verified: boolean;

    @Index('verificationCode_index')
    @Column({
        type: 'text',
        nullable: true,
    })
    verificationCode!: string | null;


    @ManyToMany(() => Organization)
    @JoinTable({
        name: "users_organizations",
        joinColumn: { name: "user_id", referencedColumnName: "id" },
        inverseJoinColumn: { name: "organization_id" }
    })
    organizations: Organization[]
    // userOrganizations: UserOrganization[];

    // @ManyToMany(type => Organization, organization => organization.users)
    // @JoinTable()
    // organizations: Organization[]

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    static createVerificationCode() {
        const verificationCode = crypto.randomBytes(32).toString('hex');

        const hashedVerificationCode = crypto
            .createHash('sha256')
            .update(verificationCode)
            .digest('hex');

        return {verificationCode, hashedVerificationCode};
    }

    toJSON() {
        return {
            ...this,
            password: undefined,
            verified: undefined,
            verificationCode: undefined,
        };
    }
}
