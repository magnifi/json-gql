const name = 'task';
const object = {
  id: '',
  owner: 'owner',
  lastUpdatedBy: 'owner',
  created: 1,
  lastUpdated: 1,
  type: 'type',
  title: '',
  subject: '',
  summary: '',
  subtasks: [],
  isSubtask: false,
  project: 'project',
  deadline: 1,
  attachments: []
};

const types = {
  'task.owner': {type: 'user', resolve: '(task) => User.findById(task.owner)'},
  'task.lastUpdatedBy': {
    type: 'user',
    resolve: '(task) => User.findById(task.lastUpdated)'
  },
  'task.project': {
    type: 'project',
    resolve: '(task) => Project.findById(task.project)'
  },
  'task.subtasks': {
    type: 'new GraphQLList(taskType)',
    resolve: '(task) => task.subtasks.map(tId => Task.findById(tId))'
  },
  'task.attachments': {
    type: 'new GraphQLList(attachmentType)',
    resolve: '(task) => task.attachments.map(tId => Attachment.findById(tId))'
  },
};
const args = {
  id: ''
};

const resolver = '(root, args) => Task.findById(args.id)';

module.exports = {name, object, types, args, resolver};
