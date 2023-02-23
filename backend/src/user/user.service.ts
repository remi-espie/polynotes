import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { UserDto, UserDtoLogin } from './user.dto';
import { PasswordProvider } from '../provider/password';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
    private passwordProvider: PasswordProvider,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async getUserId(id: string): Promise<UserDocument> {
    if (Types.ObjectId.isValid(id)) {
      const user = await this.model.findById(id).exec();
      if (!user)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      delete user.password;
      return user;
    } else throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
  }

  async getUserLogin(userDto: UserDtoLogin): Promise<UserDocument> {
    const user = await this.model.findOne({ email: userDto.email }).exec();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    if (
      await this.passwordProvider.comparePassword(
        userDto.password,
        user.password,
      )
    ) {
      delete user.password;
      return user;
    } else
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    const passwordHashed = await this.passwordProvider.hashPassword(
      userDto.password,
    );
    return await new this.model({
      ...userDto,
      password: passwordHashed,
      createdAt: new Date(),
      validated: false,
    }).save();
  }

  async update(id: string, userDto: UserDto): Promise<UserDocument> {
    return await this.model.findByIdAndUpdate(id, userDto).exec();
  }

  async delete(id: string): Promise<User> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
