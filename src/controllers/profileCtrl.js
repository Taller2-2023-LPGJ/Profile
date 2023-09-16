const profileSrv = require('../services/profileSrv');

const create = async (req, res) => {
    const { username } = req.body;

    try{
		await profileSrv.create(username);

        res.status(200).json({message: "Profile has been successfully created."});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const read = async (req, res) => {
    const { username } = req.body;

    try{
		const profile = await profileSrv.read(username);

        res.status(200).json(profile);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const update = async (req, res) => {
    const { username, displayName, location, biography, dateOfBirth } = req.body;

    try{
		await profileSrv.update(username, {displayName, location, biography, dateOfBirth});

        res.status(200).json({message: "Profile has been successfully updated."});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

module.exports = {
    create,
    read,
    update
}
