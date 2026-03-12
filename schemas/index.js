
const { pgTable, serial, varchar, boolean, integer, timestamp } = require('drizzle-orm/pg-core');

// users

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).notNull().unique(),
    password: varchar('password', { length: 100 }).notNull(),
    status: boolean('status').notNull().default(true),
    role: varchar('role', { length: 20 }).notNull().default('admin'),
});

// categories

const categories = pgTable('categories', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
});

// products

const products = pgTable("products", {
    id: serial('id').primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    categoryId: integer("category_id")
        .references(() => categories.id)
        .notNull(),

    brand: varchar("brand", { length: 255 }).default(null),
    sku: varchar("sku", { length: 100 }).unique().default(null),
    type: varchar("type", { length: 100 }).notNull(),
    description: varchar("description", { length: 1000 }).default(null),
    price: integer("price").notNull(),
    cost_price: integer("cost_price").notNull(),
});

// attributes

const attributes = pgTable("attributes", {
    id: serial('id').primaryKey(),
    productId: integer("products")
        .references(() => products.id, { onDelete: "cascade" })
        .notNull(),
    key: varchar("key", { length: 100 }).notNull(), // Example: RAM
    value: varchar("value", { length: 255 }).notNull(), // Example: 16GB
});

// stock

const stocks = pgTable("stocks", {
    id: serial('id').primaryKey(),
    productId: integer("products")
        .references(() => products.id, { onDelete: "cascade" })
        .notNull(),
    quantity: integer("quantity").notNull(),
    serial_number: varchar("serial_number", { length: 255 }),
});

// stock transaction

const stock_transactions = pgTable("stock_transactions", {
    id: serial('id').primaryKey(),
    stockId: integer("stocks")
        .references(() => stocks.id, { onDelete: "cascade" })
        .notNull(),
    quantity: integer("quantity").notNull(),
    type: varchar("type", { length: 100 }).notNull(),
    reference_id: varchar("reference_id", { length: 100 }),
    notes: varchar("notes", { length: 1000 }),
});


// customer

const customers = pgTable("customers", {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).unique(),
    phone: varchar('phone', { length: 100 }).unique(),
    address: varchar('address', { length: 100 }).default(null),
});


// suppliers 


const suppliers = pgTable("suppliers", {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 100 }).notNull(),
    email: varchar('email', { length: 100 }).unique(),
    phone: varchar('phone', { length: 100 }).unique(),
    address: varchar('address', { length: 100 }).default(null),
});

// puchase

const purchase_orders = pgTable('purchase_orders', {
    id: serial('id').primaryKey(),
    supplierId: integer('suppliers').references(() => suppliers.id, { onDelete: ('cascade') }).notNull(),
    status: varchar('status', { length: 20 }).notNull().default('pending'),
    tax: integer('tax').default(0),
    total_amount: integer('total_amount').notNull(),
    createdAt: timestamp("created_at").defaultNow(),
});


const purchase_items = pgTable('purchase_items', {
    id: serial('id').primaryKey(),
    purchaseId: integer('purchase_orders').references(() => purchase_orders.id, { onDelete: ('cascade') }).notNull(),
    productId: integer('products').references(() => products.id, { onDelete: ('cascade') }).notNull(),
    quantity: integer('quantity').notNull(),
    unit_cost: integer('unit_cost').notNull(),
    total: integer('total').notNull(),
})


// goods_receipts (GRN)

const goods_receipt_notes = pgTable('goods_receipt_notes', {
    id: serial('id').primaryKey(),
    purchaseId: integer('purchase_orders').references(() => purchase_orders.id, { onDelete: ('cascade') }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
})

module.exports = {
    users,
    categories,
    products,
    attributes,
    stocks,
    stock_transactions,
    customers,
    suppliers,
    purchase_orders,
    purchase_items,
    goods_receipt_notes
}
