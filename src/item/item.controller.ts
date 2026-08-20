import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { CreateItemDto } from './infrastructure/adapters/inbound/dtos/create-item.dto';
import { UpdateItemDto } from './infrastructure/adapters/inbound/dtos/update-item.dto';
import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { Item } from './domain/models/items';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'; 
import 'multer';

@Controller('item')
export class ItemController {
  constructor(
    private readonly createitemUsecase: CreateItemUseCase) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images'))
  create(@Body() createItemDto: CreateItemDto, @UploadedFiles() files: Express.Multer.File[]): Promise<Item> {
    const filesToUpload = files?.map((file) => ({
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
    })) || [];

    return this.createitemUsecase.execute({...createItemDto, files: filesToUpload});
  }

  // @Get()
  // findAll() {
  //   return this.itemService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.itemService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
  //   return this.itemService.update(+id, updateItemDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.itemService.remove(+id);
  // }
}
