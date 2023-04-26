import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PageService } from '../page/page.service';
import { UserService } from '../user/user.service';
import { InjectModel } from '@nestjs/mongoose';
import { FormDocument, Form } from './form.schema';
import { Model } from 'mongoose';
import { createFormDTO } from './form.dto';

@Injectable()
export class FormService {
  constructor(
    @InjectModel(Form.name)
    private readonly model: Model<FormDocument>,
    private readonly pageService: PageService,
    private readonly userService: UserService,
  ) {}

  async sendForm(
    id: string,
    formDTO: createFormDTO,
    idUser: string,
  ): Promise<FormDocument> {
    let userShared: string;
    if (idUser === 'anon') {
      userShared = 'anon';
    } else
      userShared = (await this.userService.getUserId(idUser, idUser)).email;

    return await new this.model({
      formId: id,
      user: userShared,
      formRows: formDTO.formRows,
    }).save();
  }

  async getForms(id: string, idUser: string): Promise<FormDocument[]> {
    const page = await this.pageService.findById(id, id);
    if (page.owner === idUser) {
      return await this.model.find({ formId: id }).exec();
    } else throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
  }
}
