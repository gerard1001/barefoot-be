const { hashPassword } = require('../../helpers/user.helpers');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert(
      'Users',
      [
        {
          first_name: 'SUPER_ADMIN',
          last_name: 'SUPER_ADMIN',
          password: hashPassword('SUPER_ADMIN2gmail'),
          email: 'SUPER_ADMIN@gmail.com',
          isVerified: true,
          location_id: 1,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 1,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'TRAVEL',
          last_name: 'ADMIN',
          password: hashPassword('TRAVEL_ADMIN2gmail'),
          email: 'TRAVEL_ADMIN@gmail.com',
          isVerified: true,
          location_id: 2,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 2,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'MANAGER',
          last_name: 'MANAGER',
          password: hashPassword('MANAGER2gmail'),
          email: 'MANAGER@gmail.com',
          manager_id: 3,
          isVerified: true,
          location_id: 2,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 3,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'Mark',
          last_name: 'Bernard',
          password: hashPassword('REQUESTER2gmail'),
          email: 'REQUESTER@gmail.com',
          isVerified: true,
          location_id: 3,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 4,
          manager_id: 10,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'MANAGER1',
          last_name: 'MANAGER1',
          password: hashPassword('MANAGER1gmail'),
          email: 'MANAGER1@gmail.com',
          location_id: '4',
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 3,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'REQUESTER1',
          last_name: 'REQUESTER1',
          password: hashPassword('REQUESTER2gmail'),
          email: 'REQUESTER1@gmail.com',
          location_id: 4,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          isVerified: true,
          role_id: 4,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'TESTER',
          last_name: 'TESTER',
          password: hashPassword('TESTER1cabal'),
          email: 'TESTER@gmail.com',
          address: 'kigali',
          isVerified: false,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 4,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'TESTER',
          last_name: 'TESTER',
          password: hashPassword('TESTER1cabal'),
          email: 's.gerardruta@gmail.com',
          address: 'kigali',
          isVerified: false,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 4,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'John',
          last_name: 'Doe',
          password: hashPassword('TRAVEL_ADMIN2gmail'),
          email: 'cabalbarefoot@gmail.com',
          isVerified: true,
          location_id: 1,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 2,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          first_name: 'Tom',
          last_name: 'Jerry',
          password: hashPassword('MANAGER2gmail'),
          email: 'manzigerard@gmail.com',
          isVerified: true,
          location_id: 3,
          profile_picture:
            'https://www.cobdoglaps.sa.edu.au/wp-content/uploads/2017/11/placeholder-profile-sq.jpg',
          provider: 'EMAIL',
          role_id: 3,
          manager_id: 5,
          in_app_notification: true,
          email_notification: true,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    ),
  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {})
};
