import express from 'express'

const routes = express.Router()

routes.post('/users', (req, res) => {
	const {
		name,
		email,
		password
	} = req.body

	return res.json({
		name,
		email,
		password
	})
})

export { routes }