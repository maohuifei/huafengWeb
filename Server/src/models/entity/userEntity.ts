/**
 * 用户实体类定义
 * 使用TypeORM的装饰器来定义数据库表结构
 */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

/**
 * User实体类
 * @Entity 装饰器表明这是一个数据库实体，将映射到数据库中的表
 */
@Entity()
export class User {
    /**
     * 用户ID
     * @PrimaryGeneratedColumn 表示这是一个自增的主键列
     */
    @PrimaryGeneratedColumn()
    id!: number;
    /**
     * 用户名
     * @Column 表示这是一个普通的数据库列
     * 用于用户登录和显示
     * 默认值为管理员账号
     */
    @Column({ default: 'huafengAdmin' })
    username!: string;
    /**
     * 用户密码
     * 存储用户的登录密码
     * 注意：实际生产环境中应该存储加密后的密码
     * 默认值为管理员密码
     */
    @Column({ default: 'ooo000---' })
    password!: string;
    //昵称
    @Column({ nullable: true })
    nickname!: string;
    //头像
    @Column({ nullable: true })
    avatar!: string;
    //宣言
    @Column({ nullable: true })
    declaration!: string;
    //职位
    @Column({ nullable: true })
    position!: string;
    //地址
    @Column({ nullable: true })
    address!: string;
}