import Wallet from '#models/wallet'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Wallet.createMany([
      { name: 'Alice', type: 'client', balanceCents: 100000, currencyId: 1 }, // 1000 CHF
      { name: 'Bruno', type: 'client', balanceCents: 50000, currencyId: 2 },
      { name: 'Café de la Gare', type: 'merchant', balanceCents: 0, currencyId: 3 },
    ])
  }
}
