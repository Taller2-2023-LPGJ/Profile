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
    const { user }  = req.params;
    const { username } = req.query;

    try{
		const userProfile = await profile.findExact(user ?? '');
        const followerInfo = await axios.get(process.env.CONTENT_URL + 'follow/' + user + '?username=' + username);
        const posts = await axios.get(process.env.CONTENT_URL + 'post/', {params: {...req.query, author: user}});

        res.status(followerInfo.status).json({...userProfile, ...followerInfo.data, posts: posts.data});
	} catch(err){
        if(axios.isAxiosError(err))
            res.status(err.response.status).json(err.response.data);
        else
            res.status(err.statusCode).json({ message: err.message });
    }
}

const findAlike = async (req, res) => {
    const { user, page, size }  = req.query;

    try{
		const profiles = await profile.findAlike(user, page, size);

        res.status(200).json(profiles);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const update = async (req, res) => {
    const { username, displayName, location, biography, dateOfBirth, profilePicture } = req.body;

    try{
		await profile.update(username, {displayName, location, biography, dateOfBirth, profilePicture});

        res.status(200).json({message: "Profile has been successfully updated."});
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const fetchProfileData = async (req, res) => {
    const { authors }  = req.body;

    try{
		const displayNames = await profile.fetchProfileData(authors);

        res.status(200).json(displayNames);
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

const verifyProfile = async (req, res) => {
    const { username }  = req.params;

    try{
		await profile.verifyProfile(username);

        res.status(200).json('verified profile');
	} catch(err){
        res.status(err.statusCode).json({ message: err.message });
    }
}

module.exports = {
    create,
    findExact,
    findAlike,
    update,
    fetchProfileData,
    verifyProfile
}
