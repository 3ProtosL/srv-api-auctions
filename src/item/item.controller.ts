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


  // hace falta modificacion, debido a que no se pueden seleccionar las imagenes a actualizar :p  
  @Patch(':id')
  @UseInterceptors(FilesInterceptor('images'))
  async update(
    @Param('id') id: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFiles() files?: Express.Multer.File[],
    ) {

    const newFiles = files?.map(f => ({
      buffer: f.buffer,
      originalname: f.originalname,
      mimetype: f.mimetype,
    }));

    return await this.updateItemUseCase.execute({
      _id: id,
      ...updateItemDto,
      newFiles,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deleteItemUseCase.execute(id)
  }
}
