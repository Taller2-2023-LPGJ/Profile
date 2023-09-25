const { Router } = require('express');
const router = Router();

const {
    create,
    findExact,
    findAlike,
    update,
} = require('../controllers/profile');

router.post('/', create);
router.get('/:username', findExact);
router.get('/', findAlike);
router.put('/', update);

module.exports = router;
