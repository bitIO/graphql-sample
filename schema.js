const axios = require('axios');
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
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parentValue, args) {
        const requests = parentValue.teams.map(t => (
          axios.get(`http://localhost:4000/teams/${t.teamId}`)
        ));
        return Promise
          .all(requests)
          .then(values => {
            return values.map(v => (v.data));
          });
      },
    },
  }
});

const RootQueryPlayers = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    player: {
      type: PlayerType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/players/${args.id}`)
          .then(response => (response.data))
      }
    },
    season: {
      type: SeasonType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/seasons/${args.id}`)
          .then(response => (response.data))
      }
    },
    team: {
      type: TeamType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/teams/${args.id}`)
          .then(response => (response.data))
      }
    },
    season: {
      type: SeasonType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/seasons/${args.id}`)
          .then(response => (response.data))
      }
    },
    comments: {
      type: CommentType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/comments/${args.id}`)
          .then(response => (response.data))
      }
    },
    media: {
      type: MediaType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:4000/media/${args.id}`)
          .then(response => (response.data))
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryPlayers,
});