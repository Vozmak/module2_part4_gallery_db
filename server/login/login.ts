import { Request } from 'express';
import { Users } from '../database/Models/Users.js';

type LoginResponse = {
  errorMessage: string;
} | {
  token: string
}

interface User {
  email: string;
  password: string;
}

async function login(req: Request): Promise<LoginResponse> {
  const user: User = req.body;
  const findUser: User = await Users.findOne(user);

  if (!userValidation(user)) {
    return {
      errorMessage: 'Некорректный ввод email или пароль',
    };
  }

  if (!findUser) {
    return {
      errorMessage: 'Неверный логин или пароль',
    };
  }

  return {
    token: 'token',
  };
}

function userValidation({ email, password }: User): boolean {
  const emailRegExp: RegExp = /^[a-z\d]+@[a-z]+\.[a-z]+$/i;
  const passRegExp: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z\d]{8}$/;

  return emailRegExp.test(email) && passRegExp.test(password);
}

export { login };
