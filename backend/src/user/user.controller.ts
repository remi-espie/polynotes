import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserDto } from './user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async profile(@Req() request) {
    return request.user;
  }

  @Get('/all')
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async find(@Param('id') id: string, @Req() request) {
    return await this.service.getUserId(id, request.user.id);
  }

  @Post()
  async create(@Body() userDto: UserDto) {
    return await this.service.create(userDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() userDto: UserDto,
    @Req() request,
  ) {
    return await this.service.update(id, userDto, request.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() request) {
    return await this.service.delete(id, request.user.id);
  }
}
