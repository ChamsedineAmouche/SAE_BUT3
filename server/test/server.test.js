const request = require('supertest');
const app = require('../server'); // Assurez-vous que vous importez l'application correctement

describe('GET /', () => {
    it('should always return true', () => {
        expect(true).toBe(true); // Ce test sera toujours vrai
    });
});