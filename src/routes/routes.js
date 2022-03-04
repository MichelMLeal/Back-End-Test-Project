const express = require('express')
const router = express.Router()
const {
  getInvestment,
  getInvestments,
  createInvestments,
  updateInvestments
} = require('../controllers/investmentController')

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', async (req, res) => {
  try {
    const { id } = req.body
    const result = await getInvestment(id)

    return res.json(result)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/list', async (req, res) => {
  try {
    const results = await getInvestments()

    return res.json(results)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/investment', async (req, res) => {
  try {
    let { date, investment } = req.body

    const result = await createInvestments(date, investment)

    return res.json(result)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.put('/withdrawal', async (req, res) => {
  try {
    const { date, withdrawal, id } = req.body

    const result = await updateInvestments(date, withdrawal, id)

    return res.json(result)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
