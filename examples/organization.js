const name = 'organization';
const object = {
  id: '',
  created: 1,
  owner: 'owner',
  title: '',
  email: '',
  summary: '',
  organization: 'organization'
};

const types = {
  'organization.owner': {type: 'user', resolve: '(org) => Organization.findById(org.owner)'},
};
const args = {
  id: ''
};

const resolver = '(root, args) => Organization.findById(args.id)';
module.exports = {name, object, types, args, resolver};
