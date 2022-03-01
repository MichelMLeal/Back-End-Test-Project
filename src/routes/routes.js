const express = require('express')
const moment = require('moment')
const router = express.Router()
const getinvestmentService = require('../services/getInvestmentService')
const getinvestmentsService = require('../services/getInvestmentsService')
const createInvestmentService = require('../services/createInvestmentService')
const uodateInvestmentService = require('../services/updateInvestmentService')

let investments = []

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', async function (req, res) {
  try {
    const { id } = req.body

    const result = await getinvestmentService.getInvestment(id)

    return res.json(result)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/list', async function (req, res) {
  try {
    const results = await getinvestmentsService.getInvestments()

    return res.json(results)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/investment', async (req, res) => {
  try {
    let { date, investment } = req.body
    const investmentDate = new Date(date)
    const dateNow = new Date()
    const investmentInitial = investment

    if (investment <= 0) {
      throw new Error('Investment must be greater than 0')
    }
    if (investmentDate > dateNow) {
      throw new Error('Date is in the future')
    }

    var diff = moment(dateNow, 'YYYY-MM-DD').diff(moment(investmentDate, 'YYYY-MM-DD'))
    const diffMonth = moment.duration(diff).asMonths()

    for (let i = 0; i < parseInt(diffMonth); i++) {
      investment += investment * 0.0052
    }

    investments.push(date, investmentInitial, parseFloat(investment.toFixed(2)))

    const mainn = await createInvestmentService.createInvestments(
      investmentDate,
      investmentInitial,
      parseFloat(investment.toFixed(2))
    )

    return res.json(mainn)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.put('/withdrawal', async function (req, res) {
  try {
    const { date, withdrawal, id } = req.body
    const withrawalDate = new Date(date)
    const dateNow = new Date()

    const investments = await getinvestmentService.getInvestment(id)

    if (withdrawal != investments.currentBalance) {
      throw new Error('withdrawal must be equal to investment')
    }
    if (withrawalDate > dateNow) {
      throw new Error('Date is in the future')
    }

    let profit = investments.currentBalance - investments.investment
    let taxes = 0

    var diff = moment(dateNow, 'YYYY-MM-DD').diff(moment(withrawalDate, 'YYYY-MM-DD'))
    const diffMonth = moment.duration(diff).asMonths()

    if (parseInt(diffMonth) > 2) {
      taxes = profit * 0.15
    } else if (parseInt(diffMonth) <= 2 && parseInt(diffMonth) >= 1) {
      taxes = profit * 0.185
    } else if (parseInt(diffMonth) < 1) {
      taxes = profit * 0.225
    }

    const profitFinal = parseFloat(profit.toFixed(2)) - parseFloat(taxes.toFixed(2))

    const result = await uodateInvestmentService.updateInvestments(
      9,
      withrawalDate,
      withdrawal,
      parseFloat(profitFinal.toFixed(2)),
      parseFloat(taxes.toFixed(2))
    )

    return res.json(result)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
