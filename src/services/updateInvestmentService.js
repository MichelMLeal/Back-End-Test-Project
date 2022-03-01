const { PrismaClient } = require('@prisma/client')
const moment = require('moment')
const prisma = new PrismaClient()

module.exports.updateInvestments = async function (id, date, withdrawal, profit, taxes) {
  console.log(id, date, withdrawal, profit, taxes)
  // ... you will write your Prisma Client queries here
  await prisma.investment.update({
    where: { id: id },
    data: {
      withdrawalDate: new Date(moment(date).format('YYYY-MM-DD hh:mm:ss')),
      withdrawal: withdrawal,
      currentBalance: 0,
      profit: profit,
      taxes: taxes,
      status: 'WI'
    }
  })

  return await prisma.investment.findUnique({
    where: {
      id: id
    }
  })
}

// const investments = main()
//   .catch(e => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
