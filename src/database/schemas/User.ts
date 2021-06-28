import {
	Column,
	CreateDateColumn,
	Entity,
	ObjectID,
	ObjectIdColumn,
	UpdateDateColumn
} from 'typeorm'
import { Exclude } from 'class-transformer'

@Entity('users')
export class User {
	@ObjectIdColumn()
	id: ObjectID

	@Column()
	name: string

	@Column({ nullable: false, unique: true })
	email: string

	@Column({ nullable: false })
	@Exclude()
	password: string

	@Column({ nullable: false })
	isAdmin: boolean

	@CreateDateColumn()
	created_at: Date

	@UpdateDateColumn()
	updated_at: Date
}