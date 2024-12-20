const { GraphQLError } = require('graphql');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const secret = process.env.JWT_SECRET;
const expiration = '2h';

module.exports = {
  AuthenticationError: new GraphQLError('Could not authenticate user.', {
    extensions: {
      code: 'UNAUTHENTICATED',
    },
  }),
  authMiddleware: function ({req}) {
    // allows token to be sent via  req.query or headers
    let token = req.body.token || req.query.token || req.headers.authorization;

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    if (!token) {
      return req;
    }
    
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      console.log({data})
      req.user = data;
    } catch {
      console.log('Invsalid token');
    }

    return req;
  },
  signToken: function ({ email, username, _id, hasCompletedOnboarding }) {
    const payload = { email, username, _id, hasCompletedOnboarding };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
