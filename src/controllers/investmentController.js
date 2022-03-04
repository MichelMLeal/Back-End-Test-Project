//retorna todos os serviços dos investimentos
const {
  getInvestment,
  getInvestments,
  createInvestments,
  updateInvestments
} = require('../services/investmentService')
//biblioteca para datas
const moment = require('moment')

//exporta um objeto com as funções dos controles de investimentos
module.exports = {
  getInvestment: async id => {
    return await getInvestment(id)
  },
  getInvestments: async () => {
    return await getInvestments()
  },
  createInvestments: async (date, investment) => {
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

    return await createInvestments(investmentDate, investmentInitial, parseFloat(investment.toFixed(2)))
  },
  updateInvestments: async (date, withdrawal, id) => {
    const withrawalDate = new Date(date)
    const dateNow = new Date()

    const investments = await getInvestment(id)

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

    return await updateInvestments(
      id,
      withrawalDate,
      withdrawal,
      parseFloat(profitFinal.toFixed(2)),
      parseFloat(taxes.toFixed(2))
    )
  }
}
