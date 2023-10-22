const { Router } = require('express');
const router = Router();

const {
    create,
    findExact,
    findAlike,
    update,
    fetchDisplayNames,
    verifyProfile
} = require('../controllers/profile');

router.post('/', create);
router.get('/:user', findExact);
router.get('/', findAlike);
router.put('/', update);
router.post('/displayNames', fetchDisplayNames);
router.put('/verifyProfile/:username', verifyProfile);

module.exports = router;
