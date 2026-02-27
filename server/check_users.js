const mongoose = require('mongoose');

const checkUsers = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/medicine_management');
        console.log('Connected to MongoDB');
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();
        console.log('Users in database:', users.length);
        users.forEach(u => console.log(`- ${u.email} (${u.role})`));
        await mongoose.connection.close();
    } catch (err) {
        console.error('Error:', err);
    }
};

checkUsers();
