import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';
import { Prop } from '@nestjs/mongoose';


export class UpdateItemDto extends PartialType(CreateItemDto) {
}
