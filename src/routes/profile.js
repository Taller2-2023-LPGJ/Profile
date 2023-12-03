const { Router } = require('express');
const router = Router();

const {
    create,
    findExact,
    findAlike,
    update,
    fetchProfileData,
    verify
} = require('../controllers/profile');

router.post('/', create);
router.get('/:user', findExact);
router.get('/', findAlike);
router.put('/', update);
router.post('/profileData', fetchProfileData);
router.put('/verifyProfile/:username', verify);

module.exports = router;
