'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.createTable('Users', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   firstName: {type: Sequelize.STRING},
    //   lastName: {type: Sequelize.STRING},
    //   nickname: {type: Sequelize.STRING, unique: true, allowNull: false},
    //   email: {type: Sequelize.STRING},
    //   password: {type: Sequelize.STRING, allowNull: false},
    //   phone: {type: Sequelize.STRING, unique: true},
    //   dateBirth: {type: Sequelize.DATEONLY},
    //   role: {type: Sequelize.STRING, allowNull: false, defaultValue: "USER"},
    //   reasonBlock: {type: Sequelize.STRING},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true},
    //   createdAt: {type: Sequelize.DATE, allowNull: false},
    //   updatedAt: {type: Sequelize.DATE, allowNull: false}
    // });
  
    await queryInterface.createTable('Products', {
      id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
      name: {type: Sequelize.STRING, allowNull: false, unique: true},
      description: {type: Sequelize.STRING(1000), allowNull: false},
      price: {type: Sequelize.FLOAT(8), allowNull: false},
      discount: {type: Sequelize.INTEGER},
      img: {type: Sequelize.STRING, allowNull: false},
      coverImg: {type: Sequelize.STRING, allowNull: false},
      coverVideo: {type: Sequelize.STRING},
      inHomeSlider: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
      cpu: {type: Sequelize.STRING, allowNull: false},
      graphicsCard: {type: Sequelize.STRING, allowNull: false},
      ram: {type: Sequelize.STRING, allowNull: false},
      diskMemory: {type: Sequelize.STRING, allowNull: false},
      rating: {type: Sequelize.FLOAT(2)},
      isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
      createdAt: {allowNull: false, type: Sequelize.DATE},
      updatedAt: {allowNull: false, type: Sequelize.DATE}
    });
  
    // await queryInterface.createTable('SlidesProducts', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   type: {type: Sequelize.STRING, allowNull: false},
    //   url: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    
    // await queryInterface.createTable('Advantages', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   text: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Articles', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   img: {type: Sequelize.STRING, allowNull: false},
    //   description: {type: Sequelize.STRING(1000), allowNull: false},
    //   coverImg: {type: Sequelize.STRING, allowNull: false},
    //   positionImg: {type: Sequelize.STRING, allowNull: false, defaultValue: "left"},
    //   fromBgColor: {type: Sequelize.STRING, allowNull: false, defaultValue: "#fff"},
    //   toBgColor: {type: Sequelize.STRING},
    //   isMain: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('BlocksArticles', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   img: {type: Sequelize.STRING, allowNull: false},
    //   description: {type: Sequelize.STRING(1000), allowNull: false},
    //   coverImg: {type: Sequelize.STRING, allowNull: false},
    //   positionImg: {type: Sequelize.STRING, allowNull: false, defaultValue: "left"},
    //   fromBgColor: {type: Sequelize.STRING, allowNull: false, defaultValue: "#fff"},
    //   toBgColor: {type: Sequelize.STRING},
    //   order: {type: Sequelize.INTEGER, unique: true},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('SocialLinks', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   url: {type: Sequelize.STRING, allowNull: false},
    //   img: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('MediaLinks', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   url: {type: Sequelize.STRING, allowNull: false},
    //   img: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Comments', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   text: {type: Sequelize.STRING(1000), allowNull: false},
    //   type: {type: Sequelize.STRING, allowNull: false},
    //   object: {type: Sequelize.INTEGER, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Genres', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   coverImg: {type: Sequelize.STRING},
    //   displayInHome: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Platforms', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('ExtendedCapabilities', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Activations', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('ActivationPoints', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   text: {type: Sequelize.STRING, allowNull: false},
    //   order: {type: Sequelize.INTEGER, unique: true},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Tags', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Packages', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('PickingItems', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   text: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Variations', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   description: {type: Sequelize.STRING(1000)},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Publishers', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Developers', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Languages', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('ActivationServices', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Regions', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('SeriesGames', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Categories', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   type: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Faq', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   question: {type: Sequelize.STRING, allowNull: false},
    //   answer: {type: Sequelize.STRING, allowNull: false},
    //   order: {type: Sequelize.INTEGER, unique: true},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('PaymentMethods', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   description: {type: Sequelize.STRING(1000), allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Guarantees', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.STRING, allowNull: false},
    //   description: {type: Sequelize.STRING(1000), allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Appraisals', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   value: {type: Sequelize.INTEGER, allowNull: false},
    //   type: {type: Sequelize.STRING, allowNull: false},
    //   object: {type: Sequelize.INTEGER, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
    //
    // await queryInterface.createTable('Achievements', {
    //   id: {allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER},
    //   name: {type: Sequelize.INTEGER, allowNull: false},
    //   target: {type: Sequelize.STRING, allowNull: false},
    //   object: {type: Sequelize.STRING, arguments: false},
    //   description: {type: Sequelize.STRING(1000), allowNull: false},
    //   icon: {type: Sequelize.STRING, allowNull: false},
    //   isActive: {type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false},
    //   createdAt: {allowNull: false, type: Sequelize.DATE},
    //   updatedAt: {allowNull: false, type: Sequelize.DATE}
    // });
  },
  
  down: async (queryInterface, Sequelize) => {
    //await queryInterface.dropTable('Users');
    await queryInterface.dropTable('Products');
    // await queryInterface.dropTable('SlidesProducts');
    // await queryInterface.dropTable('Advantages');
    // await queryInterface.dropTable('Articles');
    // await queryInterface.dropTable('BlocksArticles');
    // await queryInterface.dropTable('SocialLinks');
    // await queryInterface.dropTable('MediaLinks');
    // await queryInterface.dropTable('Comments');
    // await queryInterface.dropTable('Genres');
    // await queryInterface.dropTable('Platforms');
    // await queryInterface.dropTable('ExtendedCapabilities');
    // await queryInterface.dropTable('Activations');
    // await queryInterface.dropTable('ActivationPoints');
    // await queryInterface.dropTable('Tags');
    // await queryInterface.dropTable('Packages');
    // await queryInterface.dropTable('PickingItems');
    // await queryInterface.dropTable('Variations');
    // await queryInterface.dropTable('Publishers');
    // await queryInterface.dropTable('Developers');
    // await queryInterface.dropTable('Languages');
    // await queryInterface.dropTable('ActivationServices');
    // await queryInterface.dropTable('Regions');
    // await queryInterface.dropTable('SeriesGames');
    // await queryInterface.dropTable('Categories');
    // await queryInterface.dropTable('Faq');
    // await queryInterface.dropTable('PaymentMethods');
    // await queryInterface.dropTable('Guarantees');
    // await queryInterface.dropTable('Appraisals');
    // await queryInterface.dropTable('Achievements');
  }
};

//type
//allowNull
//defaultValue
//unique
//primaryKey
//autoIncrement