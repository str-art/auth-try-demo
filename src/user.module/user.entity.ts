import { Card } from "src/card.module/card.entity";
import { Columns } from "src/column.module/column.entity";
import { Comments } from "src/comment.module/comment.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()

export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({select:false})
    password: string;

    @ManyToMany(()=>Card, card => card.users)
    @JoinTable()
    cards: Card[];



    @OneToMany(()=>Comments, comment => comment.author)
    @JoinColumn()
    comments: Comments[];


    @ManyToMany(()=>Columns, columns => columns.users)
    columns: Columns[]
}