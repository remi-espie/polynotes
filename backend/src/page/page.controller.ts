import {
  Body,
  Controller,
  Delete,
  Get, HttpException, HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { createPageDto, PageDto } from './page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('page')
export class PageController {
  constructor(private readonly service: PageService) {}

  @Get('/all')
  async getAll() {
    return await this.service.getAll();
  }

  @Get(':id')
  async find(@Req() request, @Param('id') id: string) {
    if (request.user) return await this.service.findById(id, request.user.id);
    else return await this.service.findById(id, 'anon');
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findUser(@Req() request) {
    console.log(request.user)
    if (request.user) return await this.service.findByUser(request.user.id);
    else throw new HttpException("Anonymous user", HttpStatus.ACCEPTED)
  }

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  async create(@Body() pageDto: createPageDto, @Req() request) {
    return await this.service.create(pageDto, request.user.id);
  }

  @Post('/create/:id')
  @UseGuards(JwtAuthGuard)
  async createAt(
    @Param('id') id: string,
    @Body() pageDto: createPageDto,
    @Req() request,
  ) {
    return await this.service.createAt(id, pageDto, request.user.id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() pageDto: PageDto, @Req() request) {
    if (request.user) return await this.service.update(id, pageDto, request.user.id);
    else return await this.service.update(id, pageDto, 'anon');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    return await this.service.delete(id);
  }
}
