import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'currencies'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('code', 3).unique() // CHF, EUR, GBP, etc.
      table.string('origin') // CH, EUR
      table.string('name', 100) // Franc suisse, Euro, etc.
      table.string('symbol', 10) // CHF, €, £, etc.
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
