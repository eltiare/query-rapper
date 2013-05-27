test('values test', function() {
  var qw = new QueryRapper();
  qw.values = { col1: 'asdf', col2: 1234, col3: 'asdf2' };
  ok(qw.generateValuesClause() == ' ( "col1", "col2", "col3" ) VALUES ( \'asdf\', 1234, \'asdf2\' )');
});

test('where clause test', function() {
  var qw = new QueryRapper({ 'col1.ne': 3, 'col2': 'asdf', 'col3.in': [1,2,3] });
  ok(qw.generateWhereClauses() == ' WHERE ( "col1" != 3 AND "col2" = \'asdf\' AND "col3" IN  ( 1, 2, 3 ) )');
});

test('select tests', function() {
  // With order chained command
  var qw = new QueryRapper({ col1: 10 })
    .tableName('table_name')
    .order('col2 ASC');
  ok(qw.selectQuery() == 'SELECT * FROM "table_name" WHERE ( "col1" = 10 ) ORDER BY col2 ASC;');

  // Without order chained command
  qw = new QueryRapper({ col1: 10 })
    .tableName('table_name');
  ok(qw.selectQuery() == 'SELECT * FROM "table_name" WHERE ( "col1" = 10 );');

  // With AND and OR chained commands
  qw = new QueryRapper({ col1: 15})
    .and({col2: 'asdf'})
    .or({col3: [1,2,3], col4: 5})
    .tableName('table_name');
  ok(qw.selectQuery() == 'SELECT * FROM "table_name" WHERE ( ( ( "col1" = 15 ) AND ( "col2" = \'asdf\' ) ) OR ( "col3" =  ( 1, 2, 3 ) AND "col4" = 5 ) );');

  // With selectFrom
  qw = new QueryRapper({ col1: 17 })
    .selectFrom({table_name_2: 't2'}, {col1: 'c1', col2: 'c2'} )
    .selectFrom('table_name_3', ['c1', 'c2']);
  ok(qw.selectQuery() == 'SELECT "t2"."col1" AS "c1", "t2"."col2" AS "c2", "table_name_3"."c1", "table_name_3"."c2" FROM "table_name_2" AS "t2", "table_name_3" WHERE ( "col1" = 17 );');
});

test('update test', function() {
  var qw = new QueryRapper({col1: 'asdf'}).tableName('table_name');
  qw.values = { col2: 'fdsa', col3: 18 };
  ok(qw.updateQuery() == 'UPDATE "table_name" SET "col2" = \'fdsa\', "col3" = 18 WHERE ( "col1" = \'asdf\' );');
});

test('delete test', function() {
  var qw = new QueryRapper({ col1: 'asdf' }).tableName('table_name');
  ok(qw.deleteQuery() == 'DELETE FROM "table_name" WHERE ( "col1" = \'asdf\' );');
});

test('insert test', function() {
  var qw = new QueryRapper().tableName('table_name');
  qw.values = { col1: 'asdf', col2: 25 };
  ok(qw.insertQuery() == 'INSERT INTO "table_name" ( "col1", "col2" ) VALUES ( \'asdf\', 25 );');
});