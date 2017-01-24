const name = 'project';
const object = {
  id: '',
  owner: 'owner',
  lastUpdatedBy: 'owner',
  created: 1,
  lastUpdated: 1,
  type: 'type',
  name: '',
  title: '',
  subject: '',
  summary: '',
  tasks: [],
  subprojects: [],
  isSubproject: false,
};

const types = {
  'project.tasks': {
    type: 'new GraphQLList(taskType)',
    resolve: '(project) => project.tasks.map(tId = Task.findById(tId))'
  },
  'project.subprojects': {
    type: 'new GraphQLList(projectType)',
    resolve: '(project) => project.subprojects.map(pId = Project.findById(pId))'
  },
  'project.owner': {type: 'user', resolve: '(project) => User.findById(project.owner)'},
  'project.type': {type: 'projectCategory', resolve: '(project) => ProjectType.findById(project.type)'},
  'project.lastUpdatedBy': {
    type: 'user',
    resolve: '(project) => User.findById(project.lastUpdated)'
  },
};
const args = {
  id: ''
};

const resolver = '(root, args) => Project.findById(args.id)';
module.exports = {name, object, types, args, resolver};
