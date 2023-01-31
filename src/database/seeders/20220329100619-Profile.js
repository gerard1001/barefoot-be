module.exports = {
  async up(queryInterface) {
    return queryInterface.bulkInsert('Profiles', [
      {
        age: 20,
        occupation: 'software engineer',
        language: 'english',
        nationality: 'rwandan',
        date_of_birth: '2000-02-01',
        user_id: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        age: 20,
        occupation: 'software engineer',
        language: 'english',
        nationality: 'rwandan',
        date_of_birth: '2000-02-01',
        user_id: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        age: 20,
        occupation: 'software engineer',
        language: 'english',
        nationality: 'rwandan',
        date_of_birth: '2000-02-01',
        user_id: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        age: 20,
        occupation: 'software engineer',
        language: 'english',
        nationality: 'rwandan',
        date_of_birth: '2000-02-01',
        user_id: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface) {
    return queryInterface.bulkDelete('Profiles', null, {});
  }
};
