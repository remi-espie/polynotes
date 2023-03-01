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
import {PageService} from "./page.service";
import {createPageDto, PageDto} from "./page.dto";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";

@Controller('page')
export class PageController {

    constructor(private readonly service: PageService) {}
    @Get('/all')
    async getAll() {
        return await this.service.getAll();
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async find(@Param('id') id: string) {
        return await this.service.findById(id);
    }

    @Get('')
    @UseGuards(JwtAuthGuard)
    async findUser(@Req() request) {
        return await this.service.findByUser(request.user.id);
    }

    @Post('/create')
    @UseGuards(JwtAuthGuard)
    async create(@Body() pageDto: createPageDto, @Req() request) {
        return await this.service.create(pageDto, request.user.id);
    }


    @Post('/create/:id')
    @UseGuards(JwtAuthGuard)
    async createAt(@Param('id') id: string, @Body() pageDto: createPageDto, @Req() request) {
        return await this.service.createAt(id, pageDto, request.user.id);
    }

    @Patch(':id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() pageDto: PageDto) {
        return await this.service.update(id, pageDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
