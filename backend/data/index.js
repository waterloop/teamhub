const mongoose = require('mongoose');

let config = {};

if (process.env.TEAMHUB_ENV === 'testing') {
    // Different connection string required for unit tests
    config = require('./config.tests.json');
} else if (process.env.TEAMHUB_ENV === 'production' || process.env.TEAMHUB_ENV === 'preview') {
    config.url = process.env.MONGO_URL;
} else {
    config = require('./config.json');
}
const data = {};

data.connected = false;

data.initIfNotStarted = async () => {
    if (!data.connected) {
        await data.init();
    }
};

data.init = async () => {
    if (!config.url) {
        throw new Error('No URL found in config.');
    }

    await mongoose.connect(config.url, {
        useCreateIndex: true,
        useUnifiedTopology: true,
        useNewUrlParser: true,
    });

    data.connected = true;

    console.log(`Connected to: ${config.url}`);
};

data.close = async () => {
    data.connected = false;
    await mongoose.disconnect();
};

data.util = require('./handlers/util');
data.members = require('./handlers/members');
data.skills = require('./handlers/skills');
data.memberTypes = require('./handlers/memberTypes');
data.subteams = require('./handlers/subteams');
data.projects = require('./handlers/projects');
data.auth = require('./handlers/auth');
data.filters = require('./handlers/filters');
data.task = require('./handlers/task');
data.calendar = require('./handlers/calendar')

module.exports = data;
