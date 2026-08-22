import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';
import User from './User.js';
import Barang from './Barang.js';

const Peminjaman = sequelize.define('Peminjaman', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nomor_peminjaman: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  barang_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Barang,
      key: 'id'
    }
  },
  jumlah_pinjam: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  tanggal_pinjam: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  tanggal_kembali_rencana: {
    type: DataTypes.DATE,
    allowNull: true
  },
  tanggal_kembali_aktual: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('dipinjam', 'dikembalikan', 'hilang'),
    defaultValue: 'dipinjam'
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
  tableName: 'peminjamans'
});

Peminjaman.belongsTo(User, { foreignKey: 'user_id' });
Peminjaman.belongsTo(Barang, { foreignKey: 'barang_id' });
User.hasMany(Peminjaman, { foreignKey: 'user_id' });
Barang.hasMany(Peminjaman, { foreignKey: 'barang_id' });

export default Peminjaman;
