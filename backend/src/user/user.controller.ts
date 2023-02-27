import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param, Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async profile(@Req() request) {
    return request.user;
  }

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

  @Patch(':id')
  async update(@Param('id') id: string, @Body() userDto: UserDto) {
    return await this.service.update(id, userDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
