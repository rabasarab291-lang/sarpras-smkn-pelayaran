import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Barang from './Barang.js';

const Pemeliharaan = sequelize.define('Pemeliharaan', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barang,
      key: 'id'
    }
  },
  jenis_pemeliharaan: {
    type: DataTypes.ENUM('rutin', 'perbaikan', 'penggantian'),
    allowNull: false
  },
  tanggal_pemeliharaan: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  biaya: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('proses', 'selesai', 'dibatalkan'),
    defaultValue: 'proses'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false,
  tableName: 'pemeliharaans'
});

Pemeliharaan.belongsTo(Barang, { foreignKey: 'barang_id' });
Barang.hasMany(Pemeliharaan, { foreignKey: 'barang_id' });

export default Pemeliharaan;
