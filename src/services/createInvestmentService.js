const { PrismaClient } = require('@prisma/client')
const moment = require('moment')

const prisma = new PrismaClient()

module.exports.createInvestments = async function (date, investment, currentBalance) {
  await prisma.investment.create({
    data: {
      investmentDate: new Date(moment(date).format('YYYY-MM-DD hh:mm:ss')),
      investment: investment,
      currentBalance: currentBalance,
      status: 'CR'
    }
  })

  return await prisma.investment.findMany()
}

// const createInvestments = main()
//   .catch(e => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
