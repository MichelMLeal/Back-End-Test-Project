const {
  getInvestment,
  getInvestments,
  createInvestments,
  updateInvestments
} = require('../src/controllers/investmentController')
//biblioteca para datas
const moment = require('moment')

test('investment > 0', async () => {
  await expect(() =>
    createInvestments(new Date(moment('2022-02-28 00:00:00').format('YYYY-MM-DD hh:mm:ss')), -10).toThrow(
      Error
    )
  )
})

test('date > now', async () => {
  await expect(() =>
    createInvestments(new Date(moment('2023-02-28 00:00:00').format('YYYY-MM-DD hh:mm:ss')), 10).toThrow(
      Error
    )
  )
})
