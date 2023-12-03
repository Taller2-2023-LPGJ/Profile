const prisma = require('../client');
const Exception = require('../services/exception');

async function create(username){   
    try{
        await prisma.profiles.create({
            data: {
                username: username,
                displayName: username,
                location: null,
                biography: 'Welcome to my profile!',
                dateOfBirth: null,
                profilePicture: 'https://firebasestorage.googleapis.com/v0/b/snapmsg-399802.appspot.com/o/default_avatar.png?alt=media&token=2f003c2c-19ca-491c-b6b1-a08154231245'
            },
        });
    } catch(err){
        if(err.code == 'P2002')
            throw new Exception('Username already taken.', 403);
        throw new Exception('An unexpected error has occurred when trying to create your profile. Please try again later.', 500);
    }
}

async function findExact(username){
    try {
        return await prisma.profiles.findFirst({
            where: {username: username}
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function findAlike(username, page, size){
    try {
        return await prisma.profiles.findMany({
            select: {
                username: true,
                displayName: true,
                verified: true,
                profilePicture: true
            },
            where: {
                username: {
                    contains: username,
                },
            },
            skip: page * size,
            take: size,
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function update(username, updatedData){
    try {
        return updatedProfile = await prisma.profiles.update({
            where: {username: username},
            data: updatedData,
        });
    } catch(err){
        if(err.code == 'P2002')
            throw new Exception('Username already taken.', 403);
        else if(err.code == 'P2025')
            throw new Exception('Account not found.', 404);
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function fetchProfileData(username){
    try {
        return await prisma.profiles.findMany({
            where: {
                username: {
                    in: username
                }
            },
            select: {
                username: true,
                displayName: true,
                verified: true,
                profilePicture: true
            }
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    }
}

async function verify(username){
	try {
        await prisma.profiles.update({
            where: { username: username },
            data: {
                verified: true
            }
        });
    } catch(err){
        if(err.code == 'P2025')
            throw new Exception('Account not found.', 404);
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
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
