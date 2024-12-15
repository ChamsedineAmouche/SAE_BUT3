module.exports = {
    getDbConnection: () => ({
        query: jest.fn(),
        end: jest.fn(),
    }),
};