const Member = require('../schema/Member');
const skills = require('./skills');
const interests = require('./interests');
const memberTypes = require('./memberTypes');
const projects = require('./projects');
const subteams = require('./subteams');
const util = require('./util');

const members = {};

/**
 * Return all members and their associated information.
 */
members.getAll = async (fields, returnSubteamTaskList = false) => {
    return util.handleWrapper(async () => {
        if (fields) {
            const query = Member.find({}).select(fields);
            if (fields['skills']) {
                query.populate('skills');
            }
            if (fields['interests']) {
                query.populate('interests');
            }
            if (fields['memberType']) {
                query.populate('memberType');
            }
            if (fields['subteams']) {
                query.populate('subteams', returnSubteamTaskList ? '' : '-tasks');
            }
            if (fields['projects']) {
                query.populate('projects');
            }
            return (await query.exec());
        } else {
            if (!returnSubteamTaskList) {
                return (await (Member.find({})
                    .populate('skills')
                    .populate('interests')
                    .populate('memberType')
                    .populate('subteams', returnSubteamTaskList ? '' : '-tasks')
                    .populate('projects')
                    .exec()));
            }
            return (await (Member.find({})
                .populate('skills')
                .populate('interests')
                .populate('memberType')
                .populate('subteams', returnSubteamTaskList ? '' : '-tasks')
                .populate('projects')
                .exec()));
        }
    });
};

/** 
 * @param {Object} body: selection criteria for selecting members to return (ie. {email: 'steven.x@waterloop.ca'} return the member with 'steven.x@waterloop.ca' as email)
 * @param {Object} fields: specifies which fields to return
 * @param {boolean} showToken: whether or not to return the access token and expiry date of token
 * @param {boolean} returnSubteamTaskList: whether or not to return the tasks that should be completed by the member(s)
 * 
 * Returns all members (and their associated information) that match the filter criteria specified in input params
 */
members.search = async (body, fields, showToken = false, returnSubteamTaskList = false) => {
    return util.handleWrapper(async () => {
        const searchByDisplayName = body ? body.displayName : null;
        if (searchByDisplayName) {
            delete body.displayName;
        }
        if (fields) {
            const query = Member.find(body).select(fields);
            if (fields['skills']) {
                query.populate('skills');
            }
            if (fields['interests']) {
                query.populate('interests');
            }
            if (fields['memberType']) {
                query.populate('memberType');
            }
            if (fields['subteams']) {
                query.populate('subteams', returnSubteamTaskList ? '' : '-tasks');
            }
            if (fields['projects']) {
                query.populate('projects');
            }
            if (fields['tasks']) {
                query.populate('tasks');
            }
            if (showToken) {
                query.select('+token');
            }
            let res = (await query.exec());
            if (searchByDisplayName) {
                res = res.filter(function (entry) {
                    return entry.name.display === searchByDisplayName;
                }).pop();
            }
            return res;
        } else {
            let res;
            if (showToken) {
                res = await (Member.find(body)
                    .populate('skills')
                    .populate('interests')
                    .populate('memberType')
                    .populate('subteams', returnSubteamTaskList ? '' : '-tasks')
                    .populate('projects')
                    .select('+token')
                    .exec());
            } else {
                res = await (Member.find(body)
                    .populate('skills')
                    .populate('interests')
                    .populate('memberType')
                    .populate('subteams', returnSubteamTaskList ? '' : '-tasks')
                    .populate('projects')
                    .exec());
            }
            if (searchByDisplayName) {
                res = res.filter(function (entry) {
                    return entry.name.display === searchByDisplayName;
                }).pop();
            }
            return res;
        }
    });
};

/**
 * Assign a task to all members
 * 
 * @param {Object} filter: selection criteria for selecting which members to give the new task to
 * @param {Object} newTask: details describing the new task
 */
members.assignTaskToAllMembers = async (filter, newTask) => {
    return util.handleWrapper(async () => {
        return await Member.updateMany( filter, { $push: { tasks: newTask }} );
    });
}

/**
 * Add a new member to the database
 * 
 * @param {Object} memberBody: the new member's details
 */
members.add = async (memberBody) => {
    return util.handleWrapper(async () => {
        memberBody = await replaceBodyWithIds(memberBody);
        return await Member.create(memberBody);
    });
};

/**
 * Delete members from the database
 * 
 * @param {Object} body: details for selecting which member(s) to delete
 */
members.delete = async (body) => {
    return util.handleWrapper(async () => {
        return (await Member.deleteMany(body).exec());
    });
};

/**
 * Update data for a single member only
 */
members.updateMember = async (filter, body, options) => {
    if (options) {
        return util.handleWrapper(async () => {
            body = await replaceBodyWithIds(body);
            return (await Member.updateOne(filter, body, options).exec());
        });
    } else {
        return util.handleWrapper(async () => {
            body = await replaceBodyWithIds(body);
            return (await Member.updateOne(filter, body).exec());
        });
    }
};

/**
 * Update data for all members
 */
members.updateAllMembers = async (body, options) => {
    if (options) {
        return util.handleWrapper(async () => {
            body = await replaceBodyWithIds(body);
            return (await Member.updateMany({}, body, options).exec());
        });
    } else {
        return util.handleWrapper(async () => {
            body = await replaceBodyWithIds(body);
            return (await Member.updateMany({}, body).exec());
        });
    }
};

/**
 * Update the status of a task for a single member
 * 
 * @param {Object} filter: Selection criteria for the member to update 
    Example) {  _id: req.query.id, 
                "tasks": { "$elemMatch": { "_id": req.body.taskId } }
             }
 * @param {Object} body:   The new status of the task          
    Exapmle) { "tasks.$.status": req.body.status }
 */
members.updateTaskStatus = async (filter, body) => {
    return util.handleWrapper(async () => {
        return (await Member.updateOne(filter, {"$set" : body}, { runValidators: true }).exec());
    });
};

const replaceBodyWithIds = async (body) => {
    if (body.interests) {
        if (Array.isArray(body.interests)) {
            body.interests = await util.replaceNamesWithIdsArray(body.interests, interests);
        } else {
            throw Error('interests field must be empty or an array.');
        }
    }

    if (body.skills) {
        if (Array.isArray(body.skills)) {
            body.skills = await util.replaceNamesWithIdsArray(body.skills, skills);
        } else {
            throw Error('skills field must be empty or an array.');
        }
    }

    if (body.subteams) {
        if (Array.isArray(body.subteams)) {
            body.subteams = await util.replaceNamesWithIdsArray(body.subteams, subteams);
        } else {
            throw Error('subteams field must be empty or an array.');
        }
    }

    body.memberType ? body.memberType = await util.replaceNameWithId(body.memberType, memberTypes) : null;

    if (body.projects) {
        if (Array.isArray(body.projects)) {
            for (let i = 0; i < body.projects.length; i++) {
                body.projects[i] = await util.replaceNameWithId(body.projects[i], projects);
            }
        } else {
            throw Error('projects field must be empty or an array.');
        }
    }

    return body;
};

module.exports = members;