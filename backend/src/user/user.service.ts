import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly model: Model<UserDocument>,
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

  async getUser(userDto: UserDto): Promise<UserDocument> {
    const user = await this.model.findOne(userDto).exec();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    delete user.password;
    return user;
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    return await new this.model({
      ...userDto,
      createdAt: new Date(),
    }).save();
  }

  async update(id: string, userDto: UserDto): Promise<UserDocument> {
    return await this.model.findByIdAndUpdate(id, userDto).exec();
  }

  async delete(id: string): Promise<User> {
    return await this.model.findByIdAndDelete(id).exec();
  }
}
