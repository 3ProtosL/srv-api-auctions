import { Module } from '@nestjs/common';
import { ItemModule } from 'src/item/item.module';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';


@Module({
  imports: [ItemModule],
  controllers: [],
  providers: [],
})
export class AppModule {}