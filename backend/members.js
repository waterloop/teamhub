const router = require('express').Router();
const data = require('./data/index.js');

//get list of all members
router.get('/', async (req, res, next) => {
    try {
        res.send(await data.members.getAll());
    } catch (err) {
        next(err);
    }
});

//get all info about a particular member
router.get('/:id/info', async (req, res, next) => {
    try {
        res.send(await data.members.getMember(req.params.id));
    } catch (err) {
        next(err);
    }
});

//add a member
router.post('/add', async (req, res, next) => {
    try {
        res.send(await data.members.addMember(req.body.data));
    } catch (err) {
        next(err);
    }
});

//delete a member given id
router.delete('/:id/remove', async (req, res, next) => {
    try {
        res.send(await data.members.deleteMember(req.params.id));
    } catch (err) {
        next(err);
    }
});

//update member
router.put('/:id/update', async (req, res, next) => {
    try {
        res.send(await data.members.updateMember(req.params.id, req.body.data));
    } catch (err) {
        next(err);
    }
});

//get members by a particular field -- beta
// router.put('/by/:field', async (req, res, next) => {
//     try {
//         res.send(await data.members.findBy(req.params.field));
//     } catch (err) {
//         next(err);
//     }
// });

module.exports = router;