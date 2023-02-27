import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {Model, Types} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Page, PageDocument} from "./page.schema";
import {PageDto} from "./page.dto";

@Injectable()
export class PageService {

    constructor(
        @InjectModel(Page.name)
        private readonly model: Model<PageDocument>,
    ) {}

    async getAll(): Promise<Page[]> {
        return await this.model.find().exec();
    }

    async find(id: string): Promise<PageDocument> {
        if (Types.ObjectId.isValid(id)) {
            const page = await this.model.findById(id).exec();
            if (!page)
                throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
            return page;
        } else throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    async create(pageDto: PageDto): Promise<PageDocument> {
        return await new this.model({
            ...pageDto,
            createdAt: new Date(),
        }).save();
    }

    async update(id: string, pageDto: PageDto): Promise<PageDocument> {
        return await this.model.findByIdAndUpdate(id, pageDto).exec();
    }

    async delete(id: string): Promise<Page> {
        return await this.model.findByIdAndDelete(id).exec();
    }
    
}
