const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports.getInvestments = async function () {
  // ... you will write your Prisma Client queries here
  return await prisma.investment.findMany()
}

// const investments = main()
//   .catch(e => {
//     throw e
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })
