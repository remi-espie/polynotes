import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HydratedDocument, Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Page, PageDocument } from './page.schema';
import { createPageDto, PageDto } from './page.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class PageService {
  constructor(
    @InjectModel(Page.name)
    private readonly model: Model<PageDocument>,
    private readonly userService: UserService,
  ) {}

  async getAll(): Promise<Page[]> {
    return await this.model.find().exec();
  }

  async findById(id: string, idUser: string): Promise<PageDocument> {
    if (Types.ObjectId.isValid(id)) {
      const page = await this.model.findById(id).exec();
      if (!page)
        throw new HttpException('Page not found', HttpStatus.NOT_FOUND);

      if (page.owner === idUser || page.reader.includes(idUser)) return page;
      else throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    } else throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
  }

  async findByUser(
    owner: string,
  ): Promise<Array<HydratedDocument<PageDocument>>> {
    const page = await this.model.find({ owner: owner }).exec();
    if (!page) throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    return page;
  }

  async create(pageDto: createPageDto, idOwner: string): Promise<PageDocument> {
    return await this.createAt(null, pageDto, idOwner);
  }

  async createAt(
    id: string,
    pageDto: createPageDto,
    idOwner: string,
  ): Promise<PageDocument> {
    let defaultPage = [];
    if (pageDto.type === 'page')
      defaultPage = [
        {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: [],
            },
          ],
        },
      ];

    return await new this.model({
      owner: idOwner,
      type: pageDto.type,
      name: pageDto.name,
      reader: [],
      writer: [],
      parentId: id,
      modified: new Date(),
      subContent: defaultPage,
    }).save();
  }

  async update(
    id: string,
    pageDto: PageDto,
    idUser: string,
  ): Promise<PageDocument> {
    const page = await this.findById(id, idUser);
    if (page.owner === idUser || page.writer.includes(idUser))
      return await this.model.findByIdAndUpdate(id, pageDto).exec();
    else throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
  }

  async share(
    id: string,
    idUserToShare: string,
    type: string,
    idUser: string,
  ): Promise<PageDocument> {
    const page = await this.findById(id, idUser);
    if (page.owner === idUser) {
      let userToShare: string;
      if (idUserToShare === 'anon') {
        userToShare = 'anon';
      } else {
        userToShare = (await this.userService.getUserByMail(idUserToShare)).id;
      }
      if (!userToShare)
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      if (type === 'writer')
        return await this.model
          .findByIdAndUpdate(id, {
            $push: { writer: userToShare, reader: userToShare },
          })
          .exec();
      else if (type === 'reader')
        return await this.model
          .findByIdAndUpdate(id, { $push: { reader: userToShare } })
          .exec();
    } else throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
  }

  async delete(id: string, idUser): Promise<Page> {
    const page = await this.model.findById(id).exec();
    if (!page || page.owner !== idUser)
      throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
    return await this.model.findByIdAndDelete(id).exec();
  }
}