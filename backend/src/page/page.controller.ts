import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PageService } from './page.service';
import { createPageDto, PageDto } from './page.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AllowAnyGuard } from '../auth/allow-any.guard';

@Controller('page')
export class PageController {
  constructor(private readonly service: PageService) {}

  // @Get('/all')
  // async getAll() {
  //   return await this.service.getAll();
  // }

  @Get(':id')
  @UseGuards(AllowAnyGuard)
  async find(@Req() request, @Param('id') id: string) {
    if (request.user)
      return await this.service.findByIdWithUser(id, request.user.id);
    else return await this.service.findByIdWithUser(id, 'anon');
  }

  @Get('')
  @UseGuards(JwtAuthGuard)
  async findUser(@Req() request) {
    if (request.user) return await this.service.findByUser(request.user.id);
    else throw new HttpException('Anonymous user', HttpStatus.ACCEPTED);
  }

  @Post('')
  @UseGuards(AllowAnyGuard)
  async create(@Body() pageDto: createPageDto, @Req() request) {
    return await this.service.create(pageDto, request.user.id);
  }

  @Post('/:id')
  @UseGuards(JwtAuthGuard)
  async createAt(
    @Param('id') id: string,
    @Body() pageDto: createPageDto,
    @Req() request,
  ) {
    return await this.service.createAt(id, pageDto, request.user.id);
  }

  @Patch(':id')
  @UseGuards(AllowAnyGuard)
  async update(
    @Param('id') id: string,
    @Body() pageDto: PageDto,
    @Req() request,
  ) {
    if (request.user)
      return await this.service.update(id, pageDto, request.user.id);
    else return await this.service.update(id, pageDto, 'anon');
  }

  @Patch('/share/:type/:id/:idUser')
  @UseGuards(AllowAnyGuard)
  async share(
    @Param('type') type: string,
    @Param('id') id: string,
    @Param('idUser') idUser: string,
    @Req() request,
  ) {
    if (request.user)
      return await this.service.share(id, idUser, type, request.user.id);
    else return await this.service.share(id, idUser, type, 'anon');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @Req() request) {
    return await this.service.delete(id, request.user.id);
  }
}
