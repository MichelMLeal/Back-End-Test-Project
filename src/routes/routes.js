const express = require('express')
const moment = require('moment')
const router = express.Router()

let investments = []

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now())
  next()
})

router.get('/', function (req, res) {
  try {
    return res.json(investments)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.get('/list', function (req, res) {
  try {
    return res.json(investments)
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.post('/investment', (req, res) => {
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

    return res.json({ investments })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

router.put('/withdrawal', function (req, res) {
  try {
    const { date, withdrawal } = req.body
    const investmentDate = new Date(date)
    const dateNow = new Date()

    if (withdrawal != investments[2]) {
      throw new Error('withdrawal must be equal to investment')
    }
    if (investmentDate > dateNow) {
      throw new Error('Date is in the future')
    }

    let profit = investments[2] - investments[1]
    let taxes = 0

    var diff = moment(dateNow, 'YYYY-MM-DD').diff(moment(investmentDate, 'YYYY-MM-DD'))
    const diffMonth = moment.duration(diff).asMonths()

    if (parseInt(diffMonth) > 2) {
      taxes = profit * 0.15
    } else if (parseInt(diffMonth) <= 2 && parseInt(diffMonth) >= 1) {
      taxes = profit * 0.185
    } else if (parseInt(diffMonth) < 1) {
      taxes = profit * 0.225
    }
    //investments[2] = 0

    const profitFinal = parseFloat(profit.toFixed(2)) - parseFloat(taxes.toFixed(2))

    investments.push(parseFloat(profitFinal.toFixed(2)), parseFloat(taxes.toFixed(2)))

    return res.json({ investments })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
})

module.exports = router
