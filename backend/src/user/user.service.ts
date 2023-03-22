import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model, Types } from 'mongoose';
import { UserDto, UserDtoLogin } from './user.dto';
import { PasswordProvider } from '../provider/password';
import { MailService } from '../mail/mail.service';
import { FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private model: Model<UserDocument>,
    private passwordProvider: PasswordProvider,
    private mailService: MailService,
  ) {}

  async getAll(): Promise<User[]> {
    return await this.model.find().exec();
  }

  async getUserId(id: string, idUser: string): Promise<UserDocument> {
    if (Types.ObjectId.isValid(id)) {
      const user = await this.model.findById(id).exec();
      if (!user || user.id !== idUser)
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
      user.password = undefined;
      user.token = undefined;
      return user;
    } else
      throw new HttpException('Invalid credential', HttpStatus.UNAUTHORIZED);
  }

  async create(userDto: UserDto): Promise<UserDocument> {
    const token = btoa(uuidv4());
    const passwordHashed = await this.passwordProvider.hashPassword(
      userDto.password,
    );
    const emailExists = await this.model
      .findOne({ email: userDto.email })
      .exec();
    if (emailExists)
      throw new HttpException(
        'Email address already used',
        HttpStatus.BAD_REQUEST,
      );
    const user = await new this.model({
      ...userDto,
      password: passwordHashed,
      createdAt: new Date(),
      validated: false,
      token: token,
    }).save();
    await this.mailService.sendUserConfirmation(userDto, token);
    user.password = undefined;
    user.token = undefined;
    return user;
  }

  async update(
    id: string,
    userDto: UserDto,
    idUser: string,
  ): Promise<UserDocument> {
    await this.getUserId(id, idUser);
    return await this.model.findByIdAndUpdate(id, userDto).exec();
  }

  async delete(id: string, idUser: string): Promise<User> {
    await this.getUserId(id, idUser);
    return await this.model.findByIdAndDelete(id).exec();
  }

  async confirm(req: FastifyReply): Promise<UserDocument> {
    const user = await this.model
      .findOne({ token: req.request.query['token'] })
      .exec();
    if (!user) throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    user.validated = true;
    user.token = null;
    await user.save();
    return user;
  }
}
