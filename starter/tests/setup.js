require('../models/User');

const mongoose = require('mongoose');
const keys = require('../config/keys');

// mongoose want to know what implementation of promise to use
// this is nodejs global promise for record keeping
mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useMongoClient: true });

/// ===> then add option to package to force to jest to run to this.