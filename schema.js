const graphql = require('graphql');

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
} = graphql;

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    userId: { type: GraphQLString },
    when: { type: GraphQLString },
    comment: { type: GraphQLString },
  },
});
const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: {
    url: { type: GraphQLString },
  },
});

const SeasonType = new GraphQLObjectType({
  name: 'Season',
  fields: {
    name: { type: GraphQLString },
  },
});
const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: {
    name: { type: GraphQLString },
    acronym: { type: GraphQLString },
  },
});

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    surname: { type: GraphQLString },
    birth: { type: GraphQLString },
    comments: { type: new GraphQLList(CommentType) },
    media: { type: new GraphQLList(MediaType) },
    teams: { type: new GraphQLList(TeamType) },
  }
});

const RootQueryPlayers = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    player: {
      type: PlayerType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {

      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryPlayers,
});