module.exports = (sequelize, DataTypes) => {
	return sequelize.define('counting', {
		channel: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true,
		},
		number: DataTypes.INTEGER
	});
};