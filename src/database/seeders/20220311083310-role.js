module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'SUPER_ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'TRAVEL_ADMIN',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'MANAGER',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'REQUESTER',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
