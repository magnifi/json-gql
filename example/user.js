const name = 'user';
const object = {
  id: '',
  created: 1,
  lastUpdated: 1,
  role: 'role',
  firstName: '',
  lastName: '',
  displayName: '',
  title: '',
  email: '',
  summary: '',
  tasks: [],
  projects: [],
  organization: 'organization'
};

const types = {
  'user.tasks': {
    type: 'new GraphQLList(taskType)',
    resolve: '(user) => user.tasks.map(tId => Task.findById(tId))'
  },
  'user.projects': {
    type: 'new GraphQLList(projectType)',
    resolve: '(user) => user.projects.map(pId => User.findById(pId))'
  },
  'user.organization': {type: 'organization', resolve: '(user) => Organization.findById(user.organization)'},
  'user.role': {type: 'role', resolve: '(user) => Role.findById(user.role)'},
};
const args = {
  id: ''
};

const resolver = '(root, args) => User.findById(args.id)';
module.exports = {name, object, types, args, resolver};

// addQueryType(typeName, obj, pathTypes={}, args={}, resolver) {
