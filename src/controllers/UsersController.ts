import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { hash } from 'bcryptjs'

import { User } from "../database/schemas/User";

export class UsersController {

	public async create(req: Request, res: Response): Promise<Response> {
		const {
			name,
			email,
			password,
			password_confirmation
		} = req.body

		if (password !== password_confirmation) {
			return res.status(400).send('Password and password confirmation does not match')
		}

		const usersRepository = getMongoRepository(User)

		const hasAlreadyUser = await usersRepository.findOne({
			where: { email }
		})

		if (hasAlreadyUser) {
			return res.status(400).send('Email has already been registered')
		}

		const hashedPassword = await hash(password, 8)

		const user = usersRepository.create({
			name,
			email,
			password: hashedPassword,
			isAdmin: false
		})

		await usersRepository.save(user)

		return res.json(user)
	}

	public async show(_: Request, res: Response): Promise<Response> {

		const usersRepository = getMongoRepository(User)

		const users = await usersRepository.find({})

		return res.json(users)
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const { id } = req.params
		const {
			name,
			email,
			password
		} = req.body

		const usersRepository = getMongoRepository(User)

		const user = await usersRepository.findOne(id)

		if (!user) {
			return res.status(400).send('User does not exist')
		}

		const userWithSameEmail = await usersRepository.findOne({
			email
		})

		if (userWithSameEmail && String(userWithSameEmail.id) !== id) {
			return res.status(400).send('Email is already in use')
		}

		user.name = name
		user.email = email
		user.password = await hash(password, 8)

		await usersRepository.save(user)

		return res.json(user)
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const { id } = req.params

		const usersRepository = getMongoRepository(User)

		const user = await usersRepository.findOne(id)

		if (!user) {
			return res.status(400).send('User does not exist')
		}

		await usersRepository.deleteOne({
			email: user.email
		})

		return res.json(user)
	}
}