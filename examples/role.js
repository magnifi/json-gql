const name = 'role';
const object = {
  id: '',
  created: 1,
  title: '',
  summary: '',
  organization: 'organization'
};

const types = {
  'attachment.organization': {type: 'organization', resolve: '(user) => Organization.findById(user.organization)'},
};
const args = {
  id: ''
};

const resolver = '(root, args) => Attachment.findById(args.id)';
module.exports = {name, object, types, args, resolver};
