
import { Card } from "src/card.module/card.entity";
import { User } from "src/user.module/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Columns{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @OneToMany(()=> Card, card => card.columns, {cascade: ['remove']})
    @JoinColumn()
    cards: Card[];
    

    @ManyToMany(()=>User, user=>user.columns)
    @JoinTable()
    users: User[];
   
    @CreateDateColumn({select:false})
    creationDate

    @UpdateDateColumn({select:false})
    updateDate

    @DeleteDateColumn({select:false})
    deleteDate
 


}