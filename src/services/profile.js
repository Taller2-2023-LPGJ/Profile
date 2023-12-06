const database = require('../database/profile');
const Exception = require('./exception');

async function create(username){
	try{
		await database.create(username);
	} catch(err){
		throw err;
	}
}

async function findExact(username){
	try{
		const profile = await database.findExact(username);

		if(!profile){
			throw new Exception('Account not found.', 404);
		}

		return profile;
	} catch(err){
		throw err;
	}
}

async function findAlike(username, page, size){
	try{
		return await database.findAlike(username ?? '', isNaN(+page) ? 0 : +page, isNaN(+size) ? 10 : +size);
	} catch(err){
		throw err;
	}
}

async function update(username, updatedData){
	if(updatedData.dateOfBirth && updatedData.dateOfBirth !== ''){
		updatedData.dateOfBirth = new Date(updatedData.dateOfBirth);

		if(isNaN(updatedData.dateOfBirth))
			throw new Exception('Invalid date.', 422);
	}

	if(updatedData.displayName.length > 50)
		throw new Exception('Display name must be 50 characters or less.', 422);
	if(updatedData.location.length > 50)
		throw new Exception('Location must be 50 characters or less.', 422);
	if(updatedData.biography.length > 180)
		throw new Exception('Biography must be 180 characters or less.', 422);

	try{
		await database.update(username, updatedData);
	} catch(err){
		throw err;
	}
}

async function fetchProfileData(authors){
	try{
		const users = await database.fetchProfileData(authors);

		const usernameToDisplayData = {};

		users.forEach((user) => {
			let userData = {};

			userData.displayName = user.displayName;
			userData.picture = user.profilePicture;
			userData.verified = user.verified;

			usernameToDisplayData[user.username] = userData;
		});

		return usernameToDisplayData;
	} catch(err){
		throw err;
	}
}

async function verify(username){
	try{
		await database.verify(username);
	} catch(err){
		throw err;
	}
}

module.exports = {
	create,
	findExact,
	findAlike,
	update,
	fetchProfileData,
	verify
};
