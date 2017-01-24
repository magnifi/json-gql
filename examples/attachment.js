const name = 'attachment';
const object = {
  id: '',
  created: 1,
  filename: '',
  mimetype: '',
  title: '',
  summary: '',
  tasks: [],
  projects: [],
  organization: 'organization'
};

const types = {
  'attachment.tasks': {
    type: 'new GraphQLList(taskType)',
    resolve: '(attachment) => attachment.tasks.map(tId => Task.findById(tId))'
  },
  'attachment.projects': {
    type: 'new GraphQLList(projectType)',
    resolve: '(attachment) => attachment.projects.map(pId => Project.findById(pId))'
  },
  'attachment.organization': {type: 'organization', resolve: '(user) => Organization.findById(user.organization)'},
};
const args = {
  id: ''
};

const resolver = '(root, args) => Attachment.findById(args.id)';
module.exports = {name, object, types, args, resolver};
