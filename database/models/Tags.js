module.exports = (sequelize, DataTypes) => {
	return sequelize.define('tags', {
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false
		},
		guild: {
			type: DataTypes.STRING,
			allowNull: false
		},
		createdBy: DataTypes.STRING,
		updatedBy: DataTypes.STRING
	});
};