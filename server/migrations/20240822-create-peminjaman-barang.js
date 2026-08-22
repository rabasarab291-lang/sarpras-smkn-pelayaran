'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('peminjaman_barangs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      tanggal: {
        allowNull: false,
        type: Sequelize.DATE
      },
      nama_peminjam: {
        allowNull: false,
        type: Sequelize.STRING
      },
      unit_kelas: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nama_barang: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      jumlah_barang: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      jam_pinjam: {
        allowNull: false,
        type: Sequelize.TIME
      },
      kondisi_awal: {
        allowNull: false,
        type: Sequelize.ENUM('baik', 'kurang_baik', 'rusak'),
        defaultValue: 'baik'
      },
      ttd_pinjam: {
        type: Sequelize.TEXT, // Base64 encoded signature
        allowNull: true
      },
      jam_kembali: {
        type: Sequelize.TIME,
        allowNull: true
      },
      kondisi_akhir: {
        type: Sequelize.ENUM('baik', 'kurang_baik', 'rusak'),
        allowNull: true
      },
      ttd_kembali: {
        type: Sequelize.TEXT, // Base64 encoded signature
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('dipinjam', 'dikembalikan'),
        defaultValue: 'dipinjam'
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('peminjaman_barangs');
  }
};
