const mongoose = require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const Member_Stream = new Schema({
    isCoop: {
        type: Boolean,
        required: true
    },
    onStream: {
        type: Boolean,
        required: true
    },
    coopStream: {
        type: Map,
        of: Boolean
    },
    currentSchoolTerm: {
        type: String,
        required: true
    },
});

const Member_NameSchema = new Schema({
    first: {
        type: String,
        required: true
    },
    last: {
        type: String,
        required: true
    },
    display: {
        type: String
    },
});

const Member_Birthday = new Schema({
    month: {
        type: Number,
        required: true
    },
    day: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true
    }
});

const Member_Link = new Schema({
    type: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});

const Member_Task = new Schema({
    taskId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Task'
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'complete', 'irrelevant']
    },
});

const MemberSchema = new Schema({
    name: {
        type: Member_NameSchema,
        required: true,
    },
    program: {
        type: String
    },
    bio: {
        type: String
    },
    skills: [{
        type: Schema.Types.ObjectId,
        ref: 'Skill'
    }],
    interests: [{
        type: Schema.Types.ObjectId,
        ref: 'Interest'
    }],
    memberType: {
        type: Schema.Types.ObjectId,
        ref: 'MemberType'
    },
    subteams: [{
        type: Schema.Types.ObjectId,
        ref: 'Subteam',
    }],
    projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project',
    }],
    email: {
        type: String,
        required: true,
        unique: true
    },
    stream: {
        type: Member_Stream
    },
    imageUrl: {
        type: String
    },
    birthday: {
        type: Member_Birthday
    },
    links: {
        type: [Member_Link]
    },
    token: {
        type: String,
        select: false
    },
    tokenExpiry: {
        type: Number,
    },
    tasks: {
        type: [Member_Task]
    },
});

MemberSchema.plugin(uniqueValidator);
MemberSchema.plugin(deepPopulate);

let Member;
try {
    Member = mongoose.connection.model('Member');
} catch (e) {
    Member = mongoose.model('Member', MemberSchema);
}

module.exports = Member;