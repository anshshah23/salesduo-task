import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class Product extends Model {
  public id!: number;
  public asin!: string;
  public originalTitle!: string;
  public optimizedTitle!: string;
  public bulletPoints!: string;
  public description!: string;
  public keywords!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Product.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  asin: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  originalTitle: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  optimizedTitle: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bulletPoints: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  keywords: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'products',
  timestamps: true,
});

export default Product;