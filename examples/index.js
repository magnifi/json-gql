const JsonJql = require('../');
const schema = new JsonJql();
const defs = [
  require('./user'),
  require('./project'),
  require('./task'),
  require('./attachment'),
  require('./organization'),
  require('./projectCategory'),
  require('./role'),
];

defs.forEach(({name, object, types, args, resolver}) =>
  schema.addQueryType(name, object, types, args, resolver));

schema.generate();
schema.print();
