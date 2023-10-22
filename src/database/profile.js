const { PrismaClient } = require('@prisma/client');
const Exception = require('../services/exception');

async function create(username){
    const prisma = new PrismaClient();
    
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
        switch(err.code){
            case 'P2002': // Unique constraint violation
                throw new Exception('Username already taken.', 403);
            default:
                throw new Exception('An unexpected error has occurred when trying to create your profile. Please try again later.', 500);
        }
    } finally{
        await prisma.$disconnect();
    }
}

async function findExact(username){
    const prisma = new PrismaClient();
    
    try {
        return await prisma.profiles.findFirst({
            where: {username: username}
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

async function findAlike(username, limit, ord){
    const prisma = new PrismaClient();
    
    try {
        return await prisma.profiles.findMany({
            select: {
                username: true,
                displayName: true,
            },
            where: {
                username: {
                    contains: username,
                },
            },
            /*orderBy: {
                username: {
                    _count: 'desc',
                    //_rand: 'asc',
                },
            },*/
            take: limit,
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

async function update(username, updatedData){
    const prisma = new PrismaClient();
    
    try {
        return updatedProfile = await prisma.profiles.update({
            where: {username: username},
            data: updatedData,
        });
    } catch(err){
        console.log(err);
        if(err.code == 'P2025')
            throw new Exception('Account not found', 404);
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

async function fetchDisplayNames(username, updatedData){
    const prisma = new PrismaClient();
    
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
            }
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

async function getProfile(username){
    const prisma = new PrismaClient();

	try {
        var profile = await prisma.profiles.findFirst({
            where: { username: username }
        });

        return profile;
    } catch(err){
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

module.exports = {
    create,
    findExact,
    findAlike,
    update,
    fetchDisplayNames,
    getProfile
};
