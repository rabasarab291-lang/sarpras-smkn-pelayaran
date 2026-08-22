import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import Kategori from './Kategori.js';

const Barang = sequelize.define('Barang', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  kode_barang: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  nama_barang: {
    type: DataTypes.STRING,
    allowNull: false
  },
  kategori_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Kategori,
      key: 'id'
    }
  },
  jumlah: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  kondisi: {
    type: DataTypes.ENUM('baik', 'rusak_ringan', 'rusak_berat'),
    defaultValue: 'baik'
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: true
  },
  harga: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  tanggal_pembelian: {
    type: DataTypes.DATE,
    allowNull: true
  },
  keterangan: {
    type: DataTypes.TEXT,
    allowNull: true
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
  tableName: 'barangs'
});

Barang.belongsTo(Kategori, { foreignKey: 'kategori_id' });
Kategori.hasMany(Barang, { foreignKey: 'kategori_id' });

export default Barang;
