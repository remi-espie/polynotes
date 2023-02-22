import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/all')
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    return await this.service.getUserId(id);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    return await this.service.create(userDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.service.update(id, userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
