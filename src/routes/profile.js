const { Router } = require('express');
const router = Router();

const {
    create,
    findExact,
    findAlike,
    update,
    fetchDisplayNames
} = require('../controllers/profile');

router.post('/', create);
router.get('/:user', findExact);
router.get('/', findAlike);
router.put('/', update);
router.post('/displayNames', fetchDisplayNames);

module.exports = router;
