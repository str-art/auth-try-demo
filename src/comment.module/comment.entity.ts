import { Card } from "src/card.module/card.entity";
import { User } from "src/user.module/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";



@Entity()
export class Comments{
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    text: string;
    
    @ManyToOne(()=>User, user => user.cards)
    
    author: User;

    @ManyToOne(()=>Card, card => card.comments)
    
    card: Card;

}   
