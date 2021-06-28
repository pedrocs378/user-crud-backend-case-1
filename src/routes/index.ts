import express from 'express'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { UsersController } from '../controllers/UsersController'
import { SessionsController } from '../controllers/SessionsControler'

const usersController = new UsersController()
const sessionsController = new SessionsController()

const routes = express.Router()

routes.post('/users', usersController.create)
routes.get('/users', ensureAuthenticated, usersController.show)
routes.put('/users/:id', ensureAuthenticated, usersController.update)
routes.delete('/users/:id', ensureAuthenticated, usersController.delete)

routes.post('/sessions', sessionsController.create)

export { routes }