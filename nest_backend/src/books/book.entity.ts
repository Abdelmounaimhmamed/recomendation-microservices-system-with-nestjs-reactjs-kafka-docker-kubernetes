import { Entity, Column  , ObjectIdColumn, ObjectId } from 'typeorm';

@Entity()
export class Book {
  @ObjectIdColumn()
  id: string;

  @Column()
  author: string;

  @Column()
  country: string;

  @Column()
  imageLink: string;

  @Column()
  language: string;

  @Column({default : " "})
  link: string;

  @Column()
  pages: number;

  @Column()
  title: string;

  @Column()
  year: number;

  @Column()
  rating : number;

  @Column()
  userId : string;
}
