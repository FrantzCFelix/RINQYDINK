let HighscoreDAO = require('../main/daos/HighscoresDAO');

jest.mock('../main/models/highscores', () => () => {
  const SequelizeMock = require('sequelize-mock');
  const dbMock = new SequelizeMock();
  return dbMock.define('highscore', {
    id: 2,
    score: 100,
    userId: 3,
    creTs: '2019-01-01 13:30:31',
    updTs: '2019-01-01 13:30:31'
  });
});

describe('Test Sequelize Mocking', () => {
  it('Should get value from mock', async () => {
    const highscore = await HighscoreDAO.getOneHighscore();
    expect(highscore.id).toEqual(2);
  });

  it('Should get value from mock', async () => {
    const highscore = await HighscoreDAO.getOneHighscore();
    expect(highscore.score).toEqual(100);
  });

  it('Should get value from mock', async () => {
    const highscore = await HighscoreDAO.getOneHighscore();
    expect(highscore.userId).toEqual(3);
  });
});
