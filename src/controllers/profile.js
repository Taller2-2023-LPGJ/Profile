const profile = require('../services/profile');
const axios = require('axios');

const create = async (req, res) => {
    const { username } = req.body;

    try{
		await profile.create(username);

        res.status(200).json({message: "Profile has been successfully created."});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const findExact = async (req, res) => {
    const { username }  = req.params;

    try{
		const userProfile = await profile.findExact(username ?? '');
        const followerInfo = await axios.get(process.env.INTERACTION_URL + username);

        res.status(followerInfo.status).json({...userProfile, ...followerInfo.data});
	} catch(err){
        if(axios.isAxiosError(err))
            res.status(err.response.status).json(err.response.data);
        else
            res.status(err.statusCode).json({ message: err.message });
    }
}

const findAlike = async (req, res) => {
    const { username, limit, ord }  = req.query;

    try{
		const profiles = await profile.findAlike(username, limit, ord);

        res.status(200).json(profiles);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const update = async (req, res) => {
    const { username, displayName, location, biography, dateOfBirth } = req.body;

    try{
		await profile.update(username, {displayName, location, biography, dateOfBirth});

        res.status(200).json({message: "Profile has been successfully updated."});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

module.exports = {
    create,
    findExact,
    findAlike,
    update
}
