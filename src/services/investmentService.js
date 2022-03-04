//client do prisma para consultar os dados do banco
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
//biblioteca para datas
const moment = require('moment')

//exporta um objeto com as funções do banco de dados prisma
module.exports = {
  //função para consultar um investimento
  getInvestment: async function (id) {
    return await prisma.investment.findUnique({
      where: {
        id: id
      }
    })
  },
  //função para consultar todos os investimentos
  getInvestments: async function () {
    return await prisma.investment.findMany()
  },
  //função para criar um investimento
  createInvestments: async function (date, investment, currentBalance) {
    await prisma.investment.create({
      data: {
        investmentDate: new Date(moment(date).format('YYYY-MM-DD hh:mm:ss')),
        investment: investment,
        currentBalance: currentBalance,
        status: 'CR'
      }
    })

    return await prisma.investment.findMany()
  },
  //função para atualizar um investimento
  updateInvestments: async function (id, date, withdrawal, profit, taxes) {
    console.log(id, date, withdrawal, profit, taxes)
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
}
