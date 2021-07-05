import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";
import { isAfter } from 'date-fns'
import { hash } from "bcryptjs";

import { User } from "../database/schemas/User";
import { UserToken } from "../database/schemas/UserToken";

export class ResetPasswordController {

	public async create(req: Request, res: Response): Promise<Response> {
		const { token, password } = req.body

		const userTokenRepository = getMongoRepository(UserToken)
		const usersRepository = getMongoRepository(User)

		const userToken = await userTokenRepository.findOne({ token })

		if (!userToken) {
			return res.status(400).json({ message: 'Token inexistente' })
		}

		const user = await usersRepository.findOne(String(userToken.user_id))

		if (!user) {
			return res.status(400).json({ message: 'Usuário inexistente' })
		}

		if (isAfter(Date.now(), userToken.expiresIn)) {
			return res.status(400).json({ message: 'Token expirado' })
		}

		user.password = await hash(password, 8)

		await usersRepository.save(user)

		await userTokenRepository.deleteOne({ token })

		return res.status(200).send()
	}
}