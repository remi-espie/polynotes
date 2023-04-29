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

  async sendFormAnswer(
    id: string,
    formDTO: createFormDTO,
    idUser: string,
  ): Promise<FormDocument> {
    let userShared: string;
    if (idUser === 'anon') {
      userShared = 'anon';
    } else
      userShared = (await this.userService.getUserId(idUser, idUser)).email;

    const page = await this.pageService.findById(id);
    if (page.type !== 'form')
      throw new HttpException('Form not found', HttpStatus.NOT_FOUND);

    for (const [index, row] of page.subContent.entries()) {
      if (!validationRules[row.input.type](formDTO.formRows[index].content))
        throw new HttpException('Invalid form data', HttpStatus.BAD_REQUEST);
    }

    return await new this.model({
      formId: id,
      user: userShared,
      formRows: formDTO.formRows,
    }).save();
  }

  async getFormAnswers(id: string, idUser: string): Promise<FormDocument[]> {
    const page = await this.pageService.findByIdWithUser(id, idUser);
    if (page) {
      return this.model.aggregate([
        {
          $match: {
            formId: id,
          },
        },
        {
          $unwind: '$formRows',
        },
        {
          $group: {
            _id: { name: '$formRows.name' },
            values: { $push: '$formRows.content' },
            users: { $addToSet: '$user' },
          },
        },
      ]);

    } else throw new HttpException('Form not found', HttpStatus.NOT_FOUND);
  }
}

const validationRules = {
  text: (value) => typeof value === 'string' && value.length <= 256,
  paragraph: (value) => typeof value === 'string',
  checkbox: (value) => Array.isArray(value),
  radio: (value) => typeof value === 'number',
  integer: (value) => typeof value === 'number',
};