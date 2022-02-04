
import { Columns } from "src/column.module/column.entity";
import { Comments } from "src/comment.module/comment.entity";
import { User } from "src/user.module/user.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Card {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column(
     "varchar",
     {nullable: true}
    )
    text: string;
    
    @ManyToMany(()=>User, user => user.cards)
    users: User[];

    @ManyToOne(() => Columns, columns => columns.cards)
    columns: Columns;

    @OneToMany(()=>Comments, comments => comments.card,{cascade: ['remove']})
    @JoinColumn()
    comments: Comments[]
    

    






}