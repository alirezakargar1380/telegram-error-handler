import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MessengerService } from './messenger.service';
import { CreateMessengerDto } from './dto/create-messenger.dto';
import { UpdateMessengerDto } from './dto/update-messenger.dto';
import { Request } from 'express';
import { Context, Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';

@Controller('messenger')
export class MessengerController {
  constructor(
    private readonly messengerService: MessengerService,
    @InjectBot() private readonly bot: Telegraf<Context>
  ) {}

  @Post()
  create(@Body() createMessengerDto: CreateMessengerDto | any, @Req() req: Request) {
    console.log('createMessengerDto', createMessengerDto);
    let token = req.headers.authorization?.split(' ')[1]
    console.log('token', token);
    this.bot.telegram.sendMessage(Number(token), `unfortunately you have a error message! \n\n💥error type: ${createMessengerDto?.errorType}\n\n🏢<b>server name: karano</b>\n\n🔴🔴error details🔴🔴\n<code>${JSON.stringify(createMessengerDto.error)}</code>`, {
      parse_mode: 'HTML',
    })
    return this.messengerService.create(createMessengerDto);
  }

}
