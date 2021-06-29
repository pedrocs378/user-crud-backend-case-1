import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { hash } from 'bcryptjs'
import { classToClass } from "class-transformer";

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
			return res.status(400).send('A senha e a confirmação da senha precisam ser iguais')
		}

		const usersRepository = getMongoRepository(User)

		const hasAlreadyUser = await usersRepository.findOne({
			where: { email }
		})

		if (hasAlreadyUser) {
			return res.status(400).send('Este email já foi registrado')
		}

		const hashedPassword = await hash(password, 8)

		const user = usersRepository.create({
			name,
			email,
			password: hashedPassword,
			isAdmin: false
		})

		await usersRepository.save(user)

		return res.json(classToClass(user))
	}

	public async show(req: Request, res: Response): Promise<Response> {
		const { id } = req.user

		try {
			const usersRepository = getMongoRepository(User)

			const authenticatedUser = await usersRepository.findOne(id)

			if (!authenticatedUser?.isAdmin) {
				return res.status(401).json({ message: 'Você não tem autorização' })
			}

			const users = await usersRepository.find({})
			const usersWithoutAuthenticatedUser = users.filter(user => String(user.id) !== id)

			return res.json(usersWithoutAuthenticatedUser)
		} catch {
			return res.status(500).json({ message: 'Não foi possivel listar os usuários' })
		}
	}

	public async update(req: Request, res: Response): Promise<Response> {
		const { id: authenticatedUserId } = req.user
		const { id } = req.params

		const {
			name,
			email,
			password,
			password_confirmation
		} = req.body

		const usersRepository = getMongoRepository(User)

		const authenticatedUser = await usersRepository.findOne(authenticatedUserId)

		if (!authenticatedUser?.isAdmin) {
			return res.status(401).json({ message: 'Você não tem autorização' })
		}

		const user = await usersRepository.findOne(id)

		if (!user) {
			return res.status(400).json({ message: 'Usuário não existente' })
		}

		const userWithSameEmail = await usersRepository.findOne({
			email
		})

		if (userWithSameEmail && String(userWithSameEmail.id) !== id) {
			return res.status(400).json({ message: 'Este email já esta sendo usado' })
		}

		user.name = name
		user.email = email

		if (password && password_confirmation) {
			user.password = await hash(password, 8)
		}

		await usersRepository.save(user)

		return res.json(user)
	}

	public async delete(req: Request, res: Response): Promise<Response> {
		const { id: authenticatedUserId } = req.user

		const { id: user_id } = req.params

		try {
			const usersRepository = getMongoRepository(User)

			const authenticatedUser = await usersRepository.findOne(authenticatedUserId)

			if (!authenticatedUser?.isAdmin) {
				return res.status(401).json({ message: 'Você não tem autorização' })
			}

			const user = await usersRepository.findOne(user_id)

			if (!user) {
				return res.status(400).send('Usuário não existente')
			}

			await usersRepository.deleteOne({
				email: user.email
			})

			return res.json(user)
		} catch {
			return res.status(500).json({ message: 'Não foi possivel remover o usuário' })
		}
	}
}