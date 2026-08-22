'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PeminjamanBarang extends Model {
    static associate(models) {
      PeminjamanBarang.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }
  PeminjamanBarang.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    tanggal: {
      type: DataTypes.DATE,
      allowNull: false
    },
    nama_peminjam: {
      type: DataTypes.STRING,
      allowNull: false
    },
    unit_kelas: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nama_barang: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    jumlah_barang: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    jam_pinjam: {
      type: DataTypes.TIME,
      allowNull: false
    },
    kondisi_awal: {
      type: DataTypes.ENUM('baik', 'kurang_baik', 'rusak'),
      defaultValue: 'baik'
    },
    ttd_pinjam: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    jam_kembali: {
      type: DataTypes.TIME,
      allowNull: true
    },
    kondisi_akhir: {
      type: DataTypes.ENUM('baik', 'kurang_baik', 'rusak'),
      allowNull: true
    },
    ttd_kembali: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('dipinjam', 'dikembalikan'),
      defaultValue: 'dipinjam'
    },
    keterangan: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'PeminjamanBarang',
    tableName: 'peminjaman_barangs',
    timestamps: true
  });
  return PeminjamanBarang;
};
