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
            },
        });
    } catch(err){
        throw new Exception('An unexpected error has occurred when trying to create your profile. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}

async function read(username){
    const prisma = new PrismaClient();
    
    try {
        var userProfile = await prisma.profiles.findFirst({
            where: {username: username}
        });

        return userProfile;
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
        if(err.code == 'P2025')
            throw new Exception('Account not found', 404);
        throw new Exception('An unexpected error has occurred. Please try again later.', 500);
    } finally{
        await prisma.$disconnect();
    }
}


module.exports = {
    create,
    read,
    update,
};
