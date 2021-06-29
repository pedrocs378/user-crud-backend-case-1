import express from 'express'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'

import { UsersController } from '../controllers/UsersController'
import { SessionsController } from '../controllers/SessionsControler'
import { ProfileController } from '../controllers/ProfileController'

const usersController = new UsersController()
const profileController = new ProfileController()
const sessionsController = new SessionsController()

const routes = express.Router()

routes.post('/users', usersController.create)
routes.get('/users', ensureAuthenticated, usersController.show)
routes.put('/users/:id', ensureAuthenticated, usersController.update)
routes.delete('/users/:id', ensureAuthenticated, usersController.delete)

routes.put('/profile', profileController.update)

routes.post('/sessions', sessionsController.create)

export { routes }