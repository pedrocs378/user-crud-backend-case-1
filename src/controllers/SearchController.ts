import { Request, Response } from "express";
import { getMongoRepository } from "typeorm";

import { User } from "../database/schemas/User";

export class SearchController {

	public async show(req: Request, res: Response): Promise<Response> {
		try {
			const { id } = req.user
			const { name } = req.query

			const stringName = String(name)

			const usersRepository = getMongoRepository(User)

			const authenticatedUser = await usersRepository.findOne(id)

			if (!authenticatedUser) {
				return res.status(400).json({ message: 'Usuário não encontrado' })
			}

			if (!authenticatedUser.isAdmin) {
				return res.status(401).json({ message: 'Você não esta autorizado' })
			}

			const users = await usersRepository.find({
				where: {
					name: {
						$regex: new RegExp(`${stringName}`, 'gi')
					}
				}
			})

			if (users.length === 0) {
				return res.status(400).json({ message: 'Nenhum usuário encontrado' })
			}

			const usersWithoutAuthenticatedUser = users.filter(user => String(user.id) !== String(authenticatedUser.id))

			return res.json(usersWithoutAuthenticatedUser)
		} catch {
			return res.status(500).json({ message: 'Não foi possiver retornar os usuários' })
		}
	}
}