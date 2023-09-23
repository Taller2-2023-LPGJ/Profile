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

async function findAlike(username, alike, limit, ord){
    const prisma = new PrismaClient();
    
    try {
        return await prisma.profiles.findMany({
            select: {
                username: true,
                displayName: true,
            },
            where: {
                username: {
                    not: {
                        equals: username
                    },
                    contains: alike,
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
        console.log(err);
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
    findExact,
    findAlike,
    update,
};
