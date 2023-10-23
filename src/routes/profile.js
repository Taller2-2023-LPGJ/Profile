const { Router } = require('express');
const router = Router();

const {
    create,
    findExact,
    findAlike,
    update,
    fetchProfileData,
    verifyProfile
} = require('../controllers/profile');

router.post('/', create);
router.get('/:user', findExact);
router.get('/', findAlike);
router.put('/', update);
router.post('/profileData', fetchProfileData);
router.put('/verifyProfile/:username', verifyProfile);

module.exports = router;
