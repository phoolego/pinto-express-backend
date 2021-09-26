authorization = (req, res, next) => {
  const userId = req.headers['userid'];
  if (!userId) {
    return res.status(403).send({ message: 'No userId provided!' });
  }
  db.pintodb.query(
    'SELECT role FROM user WHERE user_id = ?',
    [userId],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ message: 'authorize error' });
      }
      if (result.length == 0) {
        return res.status(401).send({ message: 'no user found' });
      } else if(result[0]['role']=='CUSTOMER' || result[0]['role']=='FARMER' || result[0]['role']=='ADMIN'){
        req.userId = userId;
        next();
      }else{
        return res.status(401).send({ message: 'Unauthorized' });
      }
    }
  );
};

farmerAuthorization = (req, res, next) => {
  const userId = req.headers['userid'];
  if (!userId) {
    return res.status(403).send({ message: 'No userId provided!' });
  }
  db.pintodb.query(
    'SELECT role FROM user WHERE user_id = ?',
    [userId],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ message: 'authorize error' });
      }
      if (result.length == 0) {
        return res.status(401).send({ message: 'no user found' });
      } else if(result[0]['role']=='FARMER' || result[0]['role']=='ADMIN'){
        req.userId = userId;
        next();
      }else{
        return res.status(401).send({ message: 'user do not have farmer permission' });
      }
    }
  );
};

adminAuthorization = (req, res, next) => {
  const userId = req.headers['userid'];
  if (!userId) {
    return res.status(403).send({ message: 'No userId provided!' });
  }
  db.pintodb.query(
    'SELECT role FROM user WHERE user_id = ?',
    [userId],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ message: 'authorize error' });
      }
      if (result.length == 0) {
        return  res.status(401).send({ message: 'no user found' });
      } else if(result[0]['role']=='ADMIN'){
        req.userId = userId;
        next();
      }else{
        return res.status(401).send({ message: 'user do not have admin permission' });
      }
    }
  );
};
farmOwner = (req, res, next) => {
  const userId = req.headers['userid'];
  const farmerId = req.headers['farmerid'];
  if (!userId || !farmerId) {
    return res.status(403).send({ message: `No${userId?'':' userId'}${farmerId?'':' farmerId'} provided!` });
  }
  db.pintodb.query(
    'SELECT user_id FROM farmer WHERE user_id = ? AND farmer_id = ?',
    [userId,farmerId],
    (err, result) => {
      if(err){
        console.log(err);
        return res.status(500).send({ message: 'authorize error' });
      }
      if (result.length == 0) {
        return res.status(401).send({ message: 'unauthorize' });
      } else{
        req.farmerId = farmerId;
        next();
      }
    }
  );
};

const auth = {
  authorization,
  farmerAuthorization,
  adminAuthorization,
  farmOwner
};
module.exports = auth;
