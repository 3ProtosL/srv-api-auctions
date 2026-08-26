import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import 'multer';

import { Item } from './domain/models/items';

import { CreateItemDto } from './infrastructure/adapters/inbound/dtos/create-item.dto';
import { UpdateItemDto } from './infrastructure/adapters/inbound/dtos/update-item.dto';
import { PaginationItemssDto } from './infrastructure/adapters/inbound/dtos/pagination-items.dto';

import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { getItemUseCase } from './aplication/use-cases/get-item.use-case';
import { FindItemsUseCase } from './aplication/use-cases/find-items.use-case';
import { ItemsPagination } from './domain/models/items-pagination';
import { DeleteItemUseCase } from './aplication/use-cases/delete-item.use-case';
import { UpdateItemUseCase } from './aplication/use-cases/update-item.use-case';
import { ParseFormDataInterceptor } from 'src/shared/interceptors/parse-form-data.interceptor';

@Controller('item')
export class ItemController {
  constructor(
    private readonly createitemUseCase: CreateItemUseCase,
    private readonly getItemUseCase: getItemUseCase,
    private readonly findItemsUseCase: FindItemsUseCase,
    private readonly deleteItemUseCase: DeleteItemUseCase,
    private readonly updateItemUseCase: UpdateItemUseCase) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(@Body() createItemDto: CreateItemDto, @UploadedFiles() files: Express.Multer.File[]): Promise<Item> {
    const filesToUpload = files.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    })) || [];

    return this.createitemUseCase.execute({...createItemDto, files: filesToUpload});
  }

  @Get()
  getItems(@Query() input: PaginationItemssDto,): Promise<ItemsPagination> {
        return this.findItemsUseCase.execute(input)
  }

  @Get(':id')
  getItem(@Param('id') id: string): Promise<Item> {
    return this.getItemUseCase.execute(id)
  }



  @Patch(':id')
  @UseInterceptors(FilesInterceptor('newFiles'), ParseFormDataInterceptor)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateItemDto,
  ) {
    return await this.updateItemUseCase.execute({ _id: id, ...dto });
  }
  

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteItemUseCase.execute(id)
  }
}
