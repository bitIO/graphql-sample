const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLList,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLScalarType,
  GraphQLString,
} = graphql;

const DBSERVER = 'http://localhost:4000';

const CommentType = new GraphQLObjectType({
  name: 'Comment',
  fields: {
    userId: {
      type: GraphQLString
    },
    when: {
      type: GraphQLString
    },
    comment: {
      type: GraphQLString
    },
  },
});
const MediaType = new GraphQLObjectType({
  name: 'Media',
  fields: {
    url: {
      type: GraphQLString
    },
  },
});

const SeasonType = new GraphQLObjectType({
  name: 'Season',
  fields: {
    name: {
      type: GraphQLString
    },
  },
});
const TeamType = new GraphQLObjectType({
  name: 'Team',
  fields: {
    name: {
      type: GraphQLString
    },
    acronym: {
      type: GraphQLString
    },
  },
});

const PlayerType = new GraphQLObjectType({
  name: 'Player',
  fields: {
    id: {
      type: GraphQLString
    },
    name: {
      type: GraphQLString
    },
    surname: {
      type: GraphQLString
    },
    birth: {
      type: GraphQLString
    },
    comments: {
      type: new GraphQLList(CommentType)
    },
    media: {
      type: new GraphQLList(MediaType)
    },
    teams: {
      type: new GraphQLList(TeamType),
      resolve(parentValue, args) {
        const requests = parentValue.teams.map(t => (
          axios.get(`${DBSERVER}/teams/${t.teamId}`)
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
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/players/${args.id}`)
          .then(response => (response.data))
      }
    },
    season: {
      type: SeasonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/seasons/${args.id}`)
          .then(response => (response.data))
      }
    },
    team: {
      type: TeamType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/teams/${args.id}`)
          .then(response => (response.data))
      }
    },
    season: {
      type: SeasonType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/seasons/${args.id}`)
          .then(response => (response.data))
      }
    },
    comments: {
      type: CommentType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/comments/${args.id}`)
          .then(response => (response.data))
      }
    },
    media: {
      type: MediaType,
      args: {
        id: {
          type: GraphQLString
        }
      },
      resolve(parentValue, args) {
        return axios.get(`${DBSERVER}/media/${args.id}`)
          .then(response => (response.data))
      }
    }
  }
});

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    playerCreate: {
      type: PlayerType, // the return type of the resolve
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString),
        },
        surname: {
          type: new GraphQLNonNull(GraphQLString),
        },
        birth: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { name, surname, birth }) {
        return axios.post(`${DBSERVER}/players`, { name, surname, birth })
          .then(response => (response.data));
      }
    },
    playerUpdate: {
      type: PlayerType, // the return type of the resolve
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
        name: {
          type: GraphQLString,
        },
        surname: {
          type: GraphQLString,
        },
        birth: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, { id, name, surname, birth }) {
        return axios.patch(`${DBSERVER}/players/${id}`, { name, surname, birth })
          .then(response => (response.data));
      }
    },
    playerDelete: {
      type: PlayerType, // the return type of the resolve
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, { id }) {
        return axios.delete(`${DBSERVER}/players/${id}`)
          .then(response => (response.data));
      }
    }
  }
});

module.exports = new GraphQLSchema({
  query: RootQueryPlayers,
  mutation,
});