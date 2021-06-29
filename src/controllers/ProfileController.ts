import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { hash } from "bcryptjs";

import { User } from "../database/schemas/User";

export class ProfileController {

	public async update(req: Request, res: Response): Promise<Response> {
		const { id } = req.user
		const {
			name,
			email,
			password,
			password_confirmation
		} = req.body

		const usersRepository = getMongoRepository(User)

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
}