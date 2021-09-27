interface User {
  email: string;
  password: string;
}

import mongoose from 'mongoose';

const UserScheme = new mongoose.Schema<User>({
  email: {
    type: String,
    required: true,
  },

  password: {
    type: String,
    required: true,
  },
});

const Users = mongoose.model('Users', UserScheme, 'Users');

export { Users };
