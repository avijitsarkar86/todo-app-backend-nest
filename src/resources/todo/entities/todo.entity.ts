import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

@Entity()
export class Todo {
  @ObjectIdColumn()
  id: ObjectId;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('string', { default: 'pending' })
  status: string;
}
