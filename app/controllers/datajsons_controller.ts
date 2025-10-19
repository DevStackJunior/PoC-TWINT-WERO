import Currency from '#models/currency'
import Merchant from '#models/merchant'
import Transaction from '#models/transaction'
import User from '#models/user'
import Wallet from '#models/wallet'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { EmailOptions } from '@vinejs/vine/types'
import fs from 'node:fs'

type Type = 'client' | 'merchant'

interface Element {
  transaction: TransactionData
  user: UserData
  wallet: WalletData
  merchant: MerchantData
  currency?: CurrencyData
}

interface TransactionData {
  amount: number
  status: string
  description: string
  qr_code: string
  format: string
  user_id: User['id']
  merchant_id: Merchant['id']
  currency_id: Currency['id']
}

interface UserData {
  id: number
  pseudo: string
  email: string
  balance: number
  currency_id: Currency['id']
}

interface WalletData {
  id: number
  name: string
  balance_cents: number
  type: Type
  currency_id: Currency['id']
}

interface MerchantData {
  id: number
  name: string
  address: string
  city: string
  postal_code?: number
  balance: number
  currency_id: Currency['id']
}

interface CurrencyData {
  id: number
  code: string
  name: string
  symbol: string
}

export default class DatajsonsController {
  public async getDataTWINT({ response }: HttpContext) {
    try {
      const filePath = app.makePath('app', 'data', 'TX_TWINT.json')
      const rawData = fs.readFileSync(filePath, 'utf-8')

      //Tableau d'objets [user, transaction, merchant, qr_code]
      const data = JSON.parse(rawData)

      await Promise.all(
        data.map(async (element: Element) => {
          console.log(element.currency)
          //Nécessite de lister l'ensemble des propriétés de chaque objet car la
          //Structure des propriétés JSON source est différente de la structure de l'objet correspondant
          await Transaction.create({
            amount: element.transaction.amount,
            status: element.transaction.status,
            description: element.transaction.description,
            qrCode: element.transaction.qr_code,
            format: element.transaction.format,
            userId: element.transaction.user_id,
            merchantId: element.transaction.merchant_id,
            currencyId: element.transaction.currency_id,
          })
          await User.create({
            pseudo: element.user.pseudo,
            email: element.user.email,
            balance: element.user.balance,
            currencyId: element.user.currency_id,
          })
          await Wallet.create({
            name: element.wallet.name,
            currencyId: element.wallet.currency_id,
            balanceCents: element.wallet.balance_cents,
            type: element.wallet.type,
          })
          await Merchant.create({
            name: element.merchant.name,
            address: element.merchant.address,
            city: element.merchant.city,
            postalCode: element.merchant.postal_code,
            balance: element.merchant.balance,
            currencyId: element.merchant.currency_id,
          })
          if (element.currency) {
            await Currency.create({
              code: element.currency.code,
              name: element.currency.name,
              symbol: element.currency.symbol,
            })
          }
        })
      )

      return response.ok({
        message: ` transactions importées avec succès ✅`,
        data,
      })
    } catch (error) {
      console.error('Erreur lecture data.json:', error)
      return response.status(500).json({ error: 'Impossible de charger les données' })
    }
  }

  public async getDataWERO({ response }: HttpContext) {
    try {
      const filePath = app.makePath('app', 'data', 'TX_WERO.json')
      const rawData = fs.readFileSync(filePath, 'utf-8')

      const data = JSON.parse(rawData)

      const createdTransactions = await Transaction.createMany(data)

      return response.ok({
        message: `${createdTransactions.length} transactions importées avec succès ✅`,
        transactions: createdTransactions,
      })
    } catch (error) {
      console.error('Erreur lecture data.json:', error)
      return response.status(500).json({ error: 'Impossible de charger les données' })
    }
  }
}
