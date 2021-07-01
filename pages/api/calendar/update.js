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

            // const userId = req.body. ;          // TODO: get the user id from the request body
            const eventId = req.body.eventId ;         // TODO: get the event id from the request body
            const eventDetails = req.body.eventDetails;    // TODO: get the calendar event details from the request body
            return res.end(JSON.stringify(await data.util.resWrapper(async () => {
                // Call the function which updates a Google Calendar Event.
                return await data.calendar.update(token, eventId, eventDetails); //Deleted parameter: useId
            })));
        } else {
            res.statusCode = 401;
            res.end(JSON.stringify({message: "Not Authorized to access this webpage."}));
        }
    } else {
        res.statusCode = 404;
        res.end(JSON.stringify({}));
    }
};