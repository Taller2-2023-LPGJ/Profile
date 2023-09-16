const { Router } = require('express');
const router = Router();

const {
    create,
    read,
    update,
} = require('../controllers/profileCtrl');

router.post('/', create);
router.get('/', read);
router.put('/', update);

module.exports = router;
