import { Column, Entity, ObjectIdColumn } from "typeorm";





@Entity("Users")
export class UserEntity {

    @ObjectIdColumn()
    id: number;


    @Column()
    email: string;

    @Column()
    password: string;


    @Column()
    username: string;

}