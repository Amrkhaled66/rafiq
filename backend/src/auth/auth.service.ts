import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { SigninDto } from './dto/signin.dto';

@Injectable()
export class AuthService {
  signin(signinDto: SigninDto) {
    return 'This action adds a new auth';
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }
}
