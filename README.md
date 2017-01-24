# json-jql
# JSON to GraphQL schema code generator
Generate GraphQL schema (only query types for now) using a JSON file.

#### This is still work in progress, so use it at your own risk.

##installation
    npm install json-gql --save

##Examples:
see the example in `example` direcotry

    const JQL = require('json-gql');
    const generator = new JQL();
    generator.addQueryType('user', {
      id: 'id', name: 'name',
      age: 100, weight: 75.0,
      user_name: 'username',
      friends: ['abc', 'efg'],
      settings: {
        is_verified: false
      }
    }, {
      'user.friends': {type: 'new GraphQLList(userType)', resolve: `(user) => user.friends.map(uId => User.findById(uId))`}
      }, {
        id: 'abc',
        email: 'mail@server'
      },
      `(root, {id, email}) => args.email ? User.findOne({email}) : User.findById(id)`
    );
    generator.generate();
    // output the generated code to the console with syntax hightlighting
    generator.print();
    fs.writeFile('./scehma.js', generator.getSchemaCode());
    fs.writeFile('./db.js', generator.getMongoDBCode());

which would output

    const {
     GraphQLSchema,
     GraphQLObjectType,
     GraphQLList,
     GraphQLInt,
     GraphQLFloat,
     GraphQLBoolean,
     GraphQLString
    } = require('graphql');
    const settingType = new GraphQLObjectType({
     name: 'settings',
     fields: () => ({
       isVerified: {
         type: GraphQLBoolean,
         resolve: (settingType) => settingType.is_verified
       },
     })
    });
    const userType = new GraphQLObjectType({
     name: 'user',
     fields: () => ({
       id: {
         type: GraphQLString
       },
       name: {
         type: GraphQLString
       },
       age: {
         type: GraphQLInt
       },
       weight: {
         type: GraphQLInt
       },
       userName: {
         type: GraphQLString,
         resolve: (userType) => userType.user_name
       },
       friends: {
         type: new GraphQLList(userType),
         resolve: (user) => user.friends.map(uId => User.findById(uId))
       },
       settings: {
         type: settingType
       },
     })
    });
    const queryType = new GraphQLObjectType({
     name: 'query',
     fields: () => ({
       user: {
         type: userType,
         args: {
           id: {
             type: GraphQLString
           },
           email: {
             type: GraphQLString
           }
         },
         ,
         resolve: (root, {
           id,
           email
         }) => args.email ? User.findOne({
           email
         }) : User.findById(id),
       },
     })
    });

    module.exports = new GraphQLSchema({
     query: queryType,

    });


    const mongoose = require('mongoose');
    mongoose.promise = Promise;

    const Settings = mongoose.model('setting', {
      is_verified: Boolean,
    });
    const User = mongoose.model('user', {
      id: String,
      name: String,
      age: Number,
      weight: Number,
      user_name: String,
      friends: Array,
      settings: Object,
    });
    module.exports = {
      User,
      Settings
    }
