const bcrypt = require('bcryptjs');
const User = require('../models/user.model');
const sequelize = require('../config/connection.db');

async function updateAllPasswords() {
    try {
        // Conectar a la base de datos
        await sequelize.authenticate();
        console.log('✅ Conexión a la base de datos establecida');

        // Obtener todos los usuarios
        const users = await User.findAll();
        console.log(`📝 Encontrados ${users.length} usuarios para actualizar`);

        // Hash de la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        // Actualizar cada usuario
        let updatedCount = 0;
        for (const user of users) {
            await user.update({ password: hashedPassword });
            updatedCount++;
            console.log(`✅ Usuario actualizado: ${user.email}`);
        }

        console.log(`\n🎉 Proceso completado: ${updatedCount} usuarios actualizados`);
        console.log('🔑 Nueva contraseña para todos los usuarios: password123');

        // Cerrar la conexión
        await sequelize.close();
        console.log('👋 Conexión a la base de datos cerrada');

    } catch (error) {
        console.error('❌ Error durante la actualización:', error);
        process.exit(1);
    }
}

// Ejecutar el script
updateAllPasswords(); 