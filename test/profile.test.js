const controller = require('../src/controllers/profile');
const { prismaMock, axiosMock } = require('./singleton');
const express = require('express');
const app = express();

app.use(express.json());

let res = {
    statusVal: 500,
    jsonVal: {},
    status: jest.fn().mockImplementation((val) => {
        res = {...res, statusVal: val};
        return res;
    }),
    json: jest.fn().mockImplementation((val) => {
        res = {...res, jsonVal: val};
        return res;
    })
}

class PrismaError {
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
}

class AxiosError {
    constructor(message, code) {
        this.response = {
            data: message,
            status: code
        };
    }
}

PrismaError.prototype = new Error();
AxiosError.prototype = new Error();

describe('Create', () => {   
    test('Successfully', async () => {
        prismaMock.profiles.create.mockResolvedValue();
    
        await controller.create({ body: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).toEqual(200);
    });

    test('Unsuccessfully', async () => {
        prismaMock.profiles.create.mockRejectedValue(new Error(''));
    
        await controller.create({ body: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).not.toEqual(200);
    });

    test('Duplicate', async () => {
        prismaMock.profiles.create.mockRejectedValue(new PrismaError('', 'P2002'));
    
        await controller.create({ body: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).toEqual(403);
    });
});

describe('Update', () => {
    test('Successfully', async () => {
        prismaMock.profiles.update.mockResolvedValue();
    
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'Gastonn', location: '', biography: 'nice', dateOfBirth: '10/10/2000', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(200);
    });

    test('Duplicate', async () => {
        prismaMock.profiles.update.mockRejectedValue(new PrismaError('', 'P2002'));
    
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'Gastonn', location: '', biography: 'nice', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(403);
    });

    test('Non-Existent', async () => {
        prismaMock.profiles.update.mockRejectedValue(new PrismaError('', 'P2025'));
    
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'Gastonn', location: '', biography: 'nice', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(404);
    });

    test('Unsuccessfully', async () => {
        prismaMock.profiles.update.mockRejectedValue(new PrismaError('', 'P0'));
    
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'Gastonn', location: '', biography: 'nice', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(500);
    });

    test('Display name too long', async () => {
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', location: '', biography: 'nice', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(422);
    });

    test('Location too long', async () => {
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'gstfrenkel', location: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa', biography: 'nice', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(422);
    });

    test('Biography too long', async () => {
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'gstfrenkel', location: '', biography: 'niceeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', dateOfBirth: '', profilePicture: '' } }, res);

        expect(res.statusVal).toEqual(422);
    });

    test('Date unsuccessfully', async () => {
        await controller.update({ body: { username: 'gstfrenkel', displayName: 'gstfrenkel', location: '', biography: '', dateOfBirth: '', profilePicture: '', dateOfBirth: '22/10/2023a' } }, res);

        expect(res.statusVal).toEqual(422);
    });
});

describe('Verify', () => {
    test('Successfully', async () => {
        prismaMock.profiles.update.mockResolvedValue();
    
        await controller.verify({ params: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).toEqual(200);
    });

    test('Unsuccessfully', async () => {
        prismaMock.profiles.update.mockRejectedValue(new Error(''));
    
        await controller.verify({ params: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).not.toEqual(200);
    });

    test('Non-Existent', async () => {
        prismaMock.profiles.update.mockRejectedValue(new PrismaError('', 'P2025'));
    
        await controller.verify({ params: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).toEqual(404);
    });
});

describe('Fetch Profile Data', () => {
    test('Successfully', async () => {
        prismaMock.profiles.findMany.mockResolvedValue([
            {username: 'gstfrenkel', displayName: 'Gastón Frenkel', verified: true, profilePicture: ''},
            {username: 'lgrati', displayName: 'Lucas Grati', verified: true, profilePicture: ''},
            {username: 'pmartin', displayName: 'Pablo Martín', verified: false, profilePicture: ''},
            {username: 'jaquino', displayName: 'Julián Aquino', verified: false, profilePicture: ''},
        ]);
    
        await controller.fetchProfileData({ body: { authors: ['gstfrenkel', 'lgrati', 'pmartin', 'jaquino'] } }, res);

        expect(res.statusVal).toEqual(200);
        expect(res.jsonVal).toEqual({
            'gstfrenkel': {displayName: 'Gastón Frenkel', verified: true, picture: ''},
            'lgrati': {displayName: 'Lucas Grati', verified: true, picture: ''},
            'pmartin': {displayName: 'Pablo Martín', verified: false, picture: ''},
            'jaquino': {displayName: 'Julián Aquino', verified: false, picture: ''},
        });
    });

    test('Unsuccessfully', async () => {
        prismaMock.profiles.findMany.mockRejectedValue(new Error(''));
    
        await controller.fetchProfileData({ body: { username: 'gstfrenkel' } }, res);

        expect(res.statusVal).not.toEqual(200);
    });
});

describe('Search User', () => {
    test('Successfully', async () => {
        prismaMock.profiles.findMany.mockResolvedValue();
    
        await controller.findAlike({ query: {user: '', page: '0', size: '10'} }, res);

        expect(res.statusVal).toEqual(200);
    });

    test('Unsuccessfully', async () => {
        prismaMock.profiles.findMany.mockRejectedValue(new Error(''));
    
        await controller.findAlike({ query: {} }, res);

        expect(res.statusVal).not.toEqual(200);
    });
});
  
describe('Fetch Profile', () => {
    test('Successfully', async () => {
        prismaMock.profiles.findFirst.mockResolvedValue({});
        axiosMock.get.mockReturnValueOnce({status: 200, data: {followed: 0, followers: 0, following: false}});
        axiosMock.get.mockReturnValueOnce({data: {}});

        await controller.findExact({ params: {user: ''}, query: {username: '', page: '0', size: '10'} }, res);

        expect(res.statusVal).toEqual(200);
    });

    test('Unsuccessfully (DB error)', async () => {
        prismaMock.profiles.findFirst.mockRejectedValue(new PrismaError('', 'P0'));

        await controller.findExact({ params: {user: ''}, query: {username: '', page: '0', size: '10'} }, res);

        expect(res.statusVal).not.toEqual(200);
    });

    test('Unsuccessfully (Axios error)', async () => {
        prismaMock.profiles.findFirst.mockResolvedValue({});
        axiosMock.isAxiosError = jest.fn(() => true);
        axiosMock.get.mockRejectedValue(new AxiosError('', '500'));

        await controller.findExact({ params: {user: undefined}, query: {username: '', page: '0', size: '10'} }, res);

        expect(res.statusVal).not.toEqual(200);
    });

    test('Non-Existent', async () => {
        prismaMock.profiles.findFirst.mockResolvedValue(undefined);
    
        await controller.findExact({ params: {user: 'abc'}, query: {username: 'gstfrenkel'} }, res);

        expect(res.statusVal).toEqual(404);
    });
});
