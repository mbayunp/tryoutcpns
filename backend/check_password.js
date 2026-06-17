const bcrypt = require('bcryptjs');
const { User } = require('./src/models');

async function check() {
  try {
    const user = await User.findOne({ where: { email: 'user@wildan.com' } });
    if (!user) {
      console.log('User not found!');
      process.exit(0);
    }
    console.log('User found:', user.email);
    console.log('Hashed password in DB:', user.password);
    
    const isUser123 = bcrypt.compareSync('user123', user.password);
    console.log('Is password "user123"?', isUser123);

    const isCPNSLolos = bcrypt.compareSync('cpnslolos2026', user.password);
    console.log('Is password "cpnslolos2026"?', isCPNSLolos);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
