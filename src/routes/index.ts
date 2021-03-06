import express from 'express'

import { UsersController } from '../controllers/UsersController'
import { SessionsController } from '../controllers/SessionsControler'
import { ProfileController } from '../controllers/ProfileController'
import { SearchController } from '../controllers/SearchController'
import { ForgotPasswordController } from '../controllers/ForgotPasswordController'

import { ensureAuthenticated } from '../middlewares/ensureAuthenticated'
import { ResetPasswordController } from '../controllers/ResetPasswordController'

const usersController = new UsersController()
const searchController = new SearchController()
const profileController = new ProfileController()
const sessionsController = new SessionsController()
const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

const routes = express.Router()

routes.post('/users', usersController.create)
routes.get('/users', ensureAuthenticated, usersController.show)
routes.put('/users/:id', ensureAuthenticated, usersController.update)
routes.delete('/users/:id', ensureAuthenticated, usersController.delete)
routes.get('/users/search', ensureAuthenticated, searchController.show)

routes.post('/password/forgot', forgotPasswordController.create)
routes.post('/password/reset', resetPasswordController.create)

routes.put('/profile', ensureAuthenticated, profileController.update)

routes.post('/sessions', sessionsController.create)

export { routes }