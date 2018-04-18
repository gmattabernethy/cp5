exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('purchases', function(table) {
      table.increments('id').primary();
      table.string('name');
      table.string('email');
      table.string('address');
      table.string('city');
      table.string('st');
      table.string('zip');
      table.string('watch');
      table.string('watchName');
      table.string('text');
      table.decimal('price');	
      table.date('date');
    }),
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('purchases'),
  ]);
};
