const request = require('supertest');
const { app, server } = require('../server');  // Importez le serveur

describe('GET /', () => {
    afterAll(() => {
        server.close();  // Fermez le serveur après les tests
    });

    it('should always return true', () => {
        expect(true).toBe(true);
        console.log("True");
        server.close();  // Fermez le serveur après les tests
    });
});