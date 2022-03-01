const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports.getInvestment = async function (id) {
  // ... you will write your Prisma Client queries here
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
