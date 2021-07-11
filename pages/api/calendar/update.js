const data = require('../../../backend/data/index.js');

module.exports = async (req, res) => {
    await data.initIfNotStarted();
    if (req.method === 'PUT') {
        const authStatus = await data.auth.checkAnyUser(req.headers['authorization'], res);
        if (authStatus) {
            res.setHeader('Content-Type', 'application/json');
            
            // Get the Access Token from the request headers
            const token = req.headers['authorization'].split(' ')[1];
            res.statusCode = 200;

            const eventDetails = req.body;
            return res.end(JSON.stringify(await data.util.resWrapper(async () => {
                // Call the function which updates a Google Calendar Event.
                return await data.calendar.update(token, eventDetails, res);
            })));
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({}));
    }
};