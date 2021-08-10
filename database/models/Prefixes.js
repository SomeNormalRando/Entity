module.exports = (sequelize, DataTypes) => {
	return sequelize.define('prefixes', {
		guild: {
			type: DataTypes.STRING,
			unique: true,
			primaryKey: true
		},
		prefix: DataTypes.STRING
	});
};