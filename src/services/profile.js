const profileDB = require('../database/profile');
const Exception = require('./exception');

async function create(username){
	try{
		await profileDB.create(username);
	} catch(err){
		throw err;
	}
}

async function findExact(username){
	try{
		const profile = await profileDB.findExact(username);

		if(!profile){
			throw new Exception('Account not found.', 404);
		}

		return profile;
	} catch(err){
		throw err;
	}
}

async function findAlike(username, limit, order){
	try{
		return await profileDB.findAlike(username ?? '', limit ?? 8, order ?? 'ASC');
	} catch(err){
		throw err;
	}
}

async function update(username, updatedData){
	if(updatedData.dateOfBirth){
		try{
			updatedData.dateOfBirth = new Date(updatedData.dateOfBirth);
		} catch(err){
			throw new Exception('Invalid date', 422);
		}
	}

	if(updatedData.displayName.length > 50)
		throw new Exception('Display name must be 50 characters or less.', 422);
	if(updatedData.displayName.location > 50)
		throw new Exception('Location must be 50 characters or less.', 422);
	if(updatedData.displayName.biography > 180)
		throw new Exception('Biography must be 50 characters or less.', 422);

	try{
		await profileDB.update(username, updatedData);
	} catch(err){
		throw err;
	}
}

async function fetchDisplayNames(authors){
	try{
		const users = await profileDB.fetchDisplayNames(authors);

		const usernameToDisplayName = {};

		users.forEach((user) => {
			usernameToDisplayName[user.username] = user.displayName;
		});

		return usernameToDisplayName;
	} catch(err){
		throw err;
	}
}

async function verifyProfile(username){
	try{
		var profile = await profileDB.getProfile(username);
		profile.verified = true;
		await profileDB.update(username, profile);
	} catch(err){
		throw err;
	}
}

module.exports = {
	create,
	findExact,
	findAlike,
	update,
	fetchDisplayNames,
	verifyProfile
};
