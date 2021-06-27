import express from 'express'

import { UsersController } from '../controllers/UsersController'

const usersController = new UsersController()

const routes = express.Router()

routes.post('/users', usersController.create)
routes.get('/users', usersController.show)
routes.put('/users/:id', usersController.update)
routes.delete('/users/:id', usersController.delete)

export { routes }