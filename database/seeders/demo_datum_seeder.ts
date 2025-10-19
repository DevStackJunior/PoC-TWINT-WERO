import Merchant from '#models/merchant'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Database from '@adonisjs/lucid/services/db'

export default class extends BaseSeeder {
  async run() {
    // Insérer des utilisateurs de test
    await User.createMany([
      {
        pseudo: 'Alice',
        email: 'alice@example.com',
        balance: 150.0,
        currencyId: 1, // CHF
      },
      {
        pseudo: 'Bruno',
        email: 'bruno@example.com',
        balance: 80.0,
        currencyId: 2, // EUR
      },
      {
        pseudo: 'Camille',
        email: 'camille@example.com',
        balance: 25.0,
        currencyId: 3, // GBP
      },
      {
        pseudo: 'Jean',
        email: 'jean@example.com',
        balance: 25.0,
        currencyId: 3, // GBP
      },
      {
        pseudo: 'Albert',
        email: 'Albert@example.com',
        balance: 25.0,
        currencyId: 4, // GBP
      },
    ])

    // Insérer des commerçants de test
    await Merchant.createMany([
      {
        name: 'Café de la Gare',
        address: 'Place de la Gare 1',
        city: 'Lausanne',
        postalCode: '1003',
        balance: 0.0,
        currencyId: 1, // CHF
      },
      {
        name: 'Boutique Léman',
        address: 'Rue du Léman 15',
        city: 'Lausanne',
        postalCode: '1005',
        balance: 0.0,
        currencyId: 2, // EUR
      },
      {
        name: 'Musée Cantonal',
        address: 'Palais de Rumine',
        city: 'Lausanne',
        postalCode: '1014',
        balance: 0.0,
        currencyId: 4, // NOK
      },
    ])
  }
}
