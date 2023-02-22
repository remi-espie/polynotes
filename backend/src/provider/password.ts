import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT = 12;

@Injectable()
export class PasswordProvider {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT);
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
