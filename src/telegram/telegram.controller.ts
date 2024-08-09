import { TelegramService } from './telegram.service';
import { Action, Command, Ctx, InjectBot, Start, Update } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { COMMANDS } from './telegram.commands';
import { BOT_MESSAGES } from './telegram.messages';
import { SCENES } from 'src/common/constants';

@Update()
export class TelegramController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly telegramService: TelegramService
  ) {
    this.bot.telegram.setMyCommands(COMMANDS);
  }

  @Start()
  async startCommand(ctx): Promise<any> {
    const userTelegramName: string =
      ctx?.update?.message?.from?.first_name ||
      ctx?.update?.message?.from?.username;

    // await ctx.reply(`${userTelegramName}${BOT_MESSAGES.NEW_USER_GREETING}`);

    const chatID: number = ctx?.update?.message?.from?.id;

    console.log('chatID', chatID);

    ctx.reply(`welcome ${userTelegramName}`)

    // await new Promise((resolve) => setTimeout(resolve, 1000 * 3));

    // this.bot.telegram.sendMessage(870127846, 'Hello, this is a test message! /add_server')
    //   .then(() => {
    //     console.log('Message sent successfully');
    //   })
    //   .catch((error) => {
    //     console.error('Error sending message:', error);
    //   });

    if (!chatID) {
      await ctx.reply(`${BOT_MESSAGES.ERROR.GENERAL}`);
    }

    // const user: null | User = await this.telegramService.getUser({
    //   chatID,
    // });

    // // Handlers for new user
    // if (!user) {
    //   await ctx.reply(BOT_MESSAGES.NEW_USER_PERMISSIONS);
    // }
    // // Handlers for exist user
    // else {
    //   console.log('user', user);
    // }
  }

  @Command('add_server')
  async addServer(ctx) {
    await ctx.scene.leave();
    // Set up a listener for the next message
    await ctx.scene.enter(SCENES.add_server);
  }

  // Handle btns click
  // @Action(/^btn_payload_here/g)
  // async handler(ctx): Promise<any> {
  //   try {
  //     console.log('Yep!', ctx);
  //   } catch (error) {
  //     console.log('[error]', error);
  //   }
  // }

  // Enter dialog Scene between buyer and seller
  // @Action(/^id_0_ok/g)
  // async registerUserScene(ctx): Promise<any> {
  //   try {
  //     console.log('Yep!', ctx.scene.state);
  //     // await ctx.scene.enter(SCENES.add_server, {
        
  //     // });
  //   } catch (error) {
  //     console.log('ERROR registerUserScene enter :::', error.message);
  //   }
  // }

}
