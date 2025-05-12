import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    // 添加 ! 非空断言操作符，告诉 TypeScript 这个属性会在其他地方被赋值
    id!: number;

    @Column()
    category!: string;

    @Column()
    icon!: string;

    @Column()
    name!: string;

    @Column()
    summary!: string;

    @Column()
    url!: string;
}