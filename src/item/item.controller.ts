import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateItemDto } from './infrastructure/adapters/inbound/dtos/create-item.dto';
import { UpdateItemDto } from './infrastructure/adapters/inbound/dtos/update-item.dto';
import { CreateItemUseCase } from './aplication/use-cases/create-item.use-case';
import { Item } from './domain/models/items';

@Controller('item')
export class ItemController {
  constructor(
    private readonly createitemUsecase: CreateItemUseCase) {}

  @Post()
  create(@Body() createItemDto: CreateItemDto): Promise<Item> {
    return this.createitemUsecase.execute(createItemDto);
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
