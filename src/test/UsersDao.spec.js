let UserDAO = require('../main/daos/UsersDAO');

jest.mock('../main/models/users', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('user', {
    id: 2,
    username: 'agtravis',
    password: '1234',
    creTs: '2019-01-01 13:30:31',
    updTs: '2019-01-01 13:30:31'
  });
});

describe('Test Sequelize Mocking', () => {
  it('Should get value from mock', async () => {
    const user = await UserDAO.getOneUser();
    expect(user.id).toEqual(2);
  });

  it('Should get value from mock', async () => {
    const user = await UserDAO.getOneUser();
    expect(user.username).toEqual('agtravis');
  });

  it('Should get value from mock', async () => {
    const user = await UserDAO.getOneUser();
    expect(user.password).toEqual('1234');
  });
});
