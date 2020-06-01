const jwt = require('jsonwebtoken');

// Redis Setup
const redis = require('redis');

// You will want to update your host to the proper address in production
const redisClient = redis.createClient(process.env.REDIS_URI);

const signToken = (email) => {
  const jwtPayload = {
    email
  };
  return jwt.sign(jwtPayload, 'JWT_SECRET_KEY', {
    expiresIn: '2 days'
  });
};

const setToken = (key, value) => Promise.resolve(redisClient.set(key, value));

const createSession = (user) => {
  const {
    email,
    id
  } = user;
  const token = signToken(email);
  return setToken(token, id)
    .then(() => {
      return {
        success: 'true',
        id,
        token,
        ...user
      }
    })
    .catch();
};

const handleSignin = (db, bcrypt, req, res) => {
  const {
    email,
    password
  } = req.body;
  if (!email || !password) {
    return Promise.reject('incorrect form submission');
  }
  return db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', email)
          .then(user => user[0])
          .catch(err => Promise.reject('unable to get user'));
      } else {
        return Promise.reject('wrong credentials');
      }
    })
    .catch(err => Promise.reject('wrong credentials'));
}

const getAuthTokenId = (req, res) => {
  const {
    authorization
  } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(400).send('Unauthorized');
    }
    return res.status(200).json({
      id: reply
    })
  })
}

// (err, reply) => {
//   if (err || !reply) {
//     return res.status(401).send('Unauthorized');
//   }
//   return res.json({
//     id: reply
//   })
// }

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const {
    authorization
  } = req.headers;

  return authorization ? getAuthTokenId(req, res) :
    handleSignin(db, bcrypt, req, res)
    .then(data => data.id && data.email ? createSession(data) : Promise.reject(data))
    .then(session => {
      // console.log(session);
      return res.json(session);
    })
    .catch(err => res.status(400).json(err));
}

module.exports = {
  signinAuthentication: signinAuthentication,
  redisClient: redisClient
}