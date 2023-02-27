import {Body, Controller, Delete, Get, Param, Patch, Post} from '@nestjs/common';
import {PageService} from "./page.service";
import {PageDto} from "./page.dto";

@Controller('document')
export class PageController {

    constructor(private readonly service: PageService) {}
    @Get('/all')
    async getAll() {
        return await this.service.getAll();
    }

    @Get(':id')
    async find(@Param('id') id: string) {
        return await this.service.find(id);
    }

    @Post()
    async create(@Body() pageDto: PageDto) {
        return await this.service.create(pageDto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() pageDto: PageDto) {
        return await this.service.update(id, pageDto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
