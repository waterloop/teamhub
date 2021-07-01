const util = require('./util');
const { OAuth2Client } = require('google-auth-library');
const authConfig = require('./auth.config.json');
const {google} = require('googleapis');

const { parseISO } = require("date-fns");

const calendar = {};

/**
 * Add a new Google Calendar Event
 * 
 * @param {String} token: access_token for Oauth
 * @param {String} userId: 
 * @param {Object} eventDetails: contains details about the calendar event
 * 
 * @returns Details of the Calendar Event that got added
 */
calendar.add = async (token, userId, eventDetails) => {
    const client = new OAuth2Client(authConfig['client_id']);
    client.setCredentials({
        access_token: token
    });

    const calendar = google.calendar({version: 'v3', auth: client});
    // TODO: implement the functionality here.
    // return the details of the added Calendar event in the response body
    return {};
}


/**
 * Updates an existing Google Calendar Event
 * 
 * @param {String} token: access_token for Oauth
 * @param {String} userId: 
 * @param {String} eventId: ID of the calendar event to update
 * @param {Object} eventDetails: object containing the new data (used to update the calendar event)
 * 
 * @returns New details of the Calendar Event that got updated
 */
 calendar.update = async (token, eventId, eventDetails) => {
    const client = new OAuth2Client(authConfig['client_id'], authConfig['client_secret']);
    client.setCredentials({
        access_token: token
    });

    const calendar = google.calendar({version: 'v3', auth: client});
    // TODO: implement the functionality here.
    const {
        mySummary,
        myDescription,
        myDateIni,
        myDateEnd,
        myCalendarId
    } = eventDetails;

    var updateEvent = {
        summary: mySummary,
        description: myDescription,
        start: {
            dateTime: parseISO(myDateIni),
            timeZone: 'America/New_York' //your Timezone
        },
        end: {
            dateTime: parseISO(myDateEnd),
            timeZone: 'America/New_York' //your Timezone
        },
    };

    calendar.events.patch({
        calendarId: myCalendarId,
        eventId: eventId,
        resource: updateEvent,
    },
        // return the New details of the updated Calendar event in the response body
        function (err, updateEvent) {
            if (err) {
                console.log('There was an error contacting the Calendar service: ' + err);
                return res.json(err);
            }
            console.log('Event created: %s', updateEvent.data.htmlLink);
            console.log('Id: ', updateEvent.data.id);
            return res.json(updateEvent);
        }
    );
}

module.exports = calendar;