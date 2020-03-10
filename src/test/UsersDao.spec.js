let UserDAO = require('../main/daos/UsersDao');

jest.mock('../main/models/users', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('user', {
    userId: 2,
    username: 'agtravis',
    password: '1234',
    creTs: '2019-01-01 13:30:31',
    updTs: '2019-01-01 13:30:31'
  });
});

describe('Test Sequelize Mocking', () => {
  it('Should get value from mock', async () => {
    const user = await UserDAO.getOneUser();
    expect(user.username).toEqual('agtravis');
  });
});
