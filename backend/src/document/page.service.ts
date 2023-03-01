import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {HydratedDocument, Model, Types} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {Page, PageDocument} from "./page.schema";
import {createPageDto, PageDto} from "./page.dto";

@Injectable()
export class PageService {

    constructor(
        @InjectModel(Page.name)
        private readonly model: Model<PageDocument>,
    ) {
    }

    async getAll(): Promise<Page[]> {
        return await this.model.find().exec();
    }

    async findById(id: string): Promise<PageDocument> {
        if (Types.ObjectId.isValid(id)) {
            const page = await this.model.findById(id).exec();
            if (!page)
                throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
            return page;
        } else throw new HttpException('Invalid ID', HttpStatus.BAD_REQUEST);
    }

    async findByUser(owner: string): Promise<Array<HydratedDocument<PageDocument>>> {
        const page = await this.model.find({owner: owner}).exec();
        if (!page)
            throw new HttpException('Page not found', HttpStatus.NOT_FOUND);
        return page;
    }

    async create(pageDto: createPageDto, ownerid: string): Promise<PageDocument> {
        return await new this.model({
            owner: ownerid,
            type: pageDto.type,
            name: pageDto.name,
            reader: [],
            writer: [],
            modified: new Date(),
        }).save();
    }

    async createAt(id:string, pageDto: createPageDto, ownerid: string): Promise<PageDocument> {
        const parent = await this.findById(id)
        const child = await new this.model({
            owner: ownerid,
            type: pageDto.type,
            name: pageDto.name,
            reader: [],
            writer: [],
            modified: new Date(),
        });

        parent.content.push(child)
        await parent.save()
        return child
    }

    async update(id: string, pageDto: PageDto): Promise<PageDocument> {
        return await this.model.findByIdAndUpdate(id, pageDto).exec();
    }

    async delete(id: string): Promise<Page> {
        return await this.model.findByIdAndDelete(id).exec();
    }

}
