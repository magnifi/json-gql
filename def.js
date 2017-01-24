const {
  camelCase,
  capitalize,
  isInteger,
  isNumber,
  isString,
  isArray,
  isObject,
  isBoolean,
  isEmpty
} = require('lodash');
const __ = require('lodash-inflection');
const cardinal = require('cardinal');
const {js_beautify} = require('js-beautify');
const theme = require('./js-theme');

const GQL_IMPORTS = ` const {
  GraphQLSchema, GraphQLObjectType, GraphQLList, GraphQLInt, GraphQLFloat, GraphQLBoolean, GraphQLString
} = require('graphql');`;

function getType(t) {
  if(t.match(/(^.+?Type)|(GraphQLList)/)) return t;
  return camelCase(__.singularize(t) + '-type');
}
function getResolvedName(t) {
  let newName = camelCase(t);
  if(newName !== t) return newName;
}
function getJSType(s) {
  if(isString(s)) return 'String';
  if(isNumber(s)) return 'Number';
  if(isBoolean(s)) return 'Boolean';
  if(isArray(s)) return 'Array';
  if(isObject(s)) return 'Object';
  return 'UNKNOWN_TYPE';
}
function getGraphQLType(s) {
  if(isString(s)) return 'GraphQLString';
  if(isInteger(s)) return 'GraphQLInt';
  if(isNumber(s)) return 'GraphQLFloat';
  if(isBoolean(s)) return 'GraphQLBoolean';
  return 'UNKNOWN_TYPE';
}
class Defs {
  constructor() {
    this._types = {};
    this._queryDefs = [];
    this.typeDefs = [];
    this.header = GQL_IMPORTS;
    this.defs = '';
    /* TODO Add mutation types */
    this.hasMutation = false;

    this.exports = `
    const queryType = new GraphQLObjectType({
      name: 'query',
      fields: () => ({
    `;

    this._dbExports = [];
    this._dbCode = `
    const mongoose = require('mongoose');
    mongoose.promise = Promise;
    `
  }
  __define(type, obj, map, path) {
    path = path || [type];
    const typeName = getType(type);
    if(this._types[typeName]) return;
    let dbCode = `
    const ${capitalize(type)} = mongoose.model('${__.singularize(type)}', {
    `;
    this._dbExports.push(capitalize(type));
    let code = `
      const ${getType(typeName)} = new GraphQLObjectType({
        name: '${type}',
        fields: () => ({
    `;
    let pathParts, pathName;
    for(let k in obj) {
      let val = obj[k];
      dbCode += `${k}: ${getJSType(val)},`;
      let resolvedName = getResolvedName(k);
      let needResolve = !!resolvedName;
      const attrName = resolvedName || k;
      code += `${attrName}: {`;
      pathParts = [...path, attrName];
      pathName = pathParts.join('.');
      const opts = map[pathName];
      if(opts) {
        obj[attrName] = {};
        if(opts.type) {
          code += ` type: ${getType(opts.type)}, `;
        }
        if(opts.resolve) code += `
          resolve: ${opts.resolve} `;
      } else if(isArray(val)) {
        /* TODO Handle Array types */
      } else if(isObject(val)) {
        code += `type: ${getType(k)}`
        this.__define(k, val, map, pathParts);
      } else {
        const graphType = getGraphQLType(val);
        code += `type: ${graphType}`;
      }
      if(needResolve && !(opts && opts.resolve)) code += `
      resolve: (${typeName}) => ${typeName}.${k}
      `;
      code += `},`
    }
    code += '})'
    code += '});'
    dbCode += '});';
    this._dbCode += dbCode;
    this.defs += code;
    this._types[typeName] = true;
  }
  addQueryType(typeName, obj, pathTypes={}, args={}, resolver) {
    this.__define(typeName, obj, pathTypes);
    this._queryDefs.push({typeName, obj, pathTypes, args, resolver});

  }
  generate() {
    for(let {typeName, obj, pathTypes, args, resolver=''} of this._queryDefs) {
      let argsDef = '';
      if(resolver) {
        resolver = `resolve: ${resolver},`
      }
      if(!isEmpty(args)) {
        argsDef = 'args: {' + Object.keys(args).map(arg => {
          return `${arg}: {type: ${getGraphQLType(args[arg]) } }`
        }).join(',') + '},';
      }
      this.exports += ` ${typeName}: {
          type: ${getType(typeName)},
          ${argsDef}
          ${resolver}
          },
      `;
    }
    this.exports += `})});

    module.exports = new GraphQLSchema({
      query: queryType,
      ${this.hasMutation ? 'mutation: mutationType' : ''}
    });
    `
    this._dbCode += `
    module.exports = {
      ${this._dbExports.join(',')}
    }
    `;
    this.__code__ = js_beautify(this.header + this.defs + this.exports, {
      indent_size: 2}
    );
    this._dbCode = js_beautify(this._dbCode, {
      indent_size: 2}
    );
  }
  print() {
    this.__code__ = `
    // GraphQL schema definition
    `;
    this.__code__ += this.header + this.defs + this.exports;
    this.__code__ += `
    // Mongodb models definition
    `;
    // this.__code__ += this._dbCode;
    try{
      console.log(cardinal.highlight(
        this.format(this.__code__)
        , { linenos: true, theme })
      );
    }catch(e) {
      throw e;
    }
  }
  format(code) {
    return js_beautify(code, {indent_size: 2});
  }

  getSchemaCode() {
    return this.format(this.header + this.defs + this.exports);
  }
  getMongoDBCode() {
    return this.format(this._dbCode);
  }
};

module.exports = Defs;
