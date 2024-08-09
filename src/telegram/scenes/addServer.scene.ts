import { Context, Wizard, WizardStep } from 'nestjs-telegraf';

import { Markup } from 'telegraf';

// import { TelegramUtils } from '../telegram.utils';
import { TelegramService } from '../telegram.service';

// import { validateText, validateUserLastName } from '../../common/utils';

import { BOT_MESSAGES } from '../telegram.messages';
import { SCENES, TELEGRAM_BTN_ACTIONS } from 'src/common/constants';
// import { TELEGRAM_BTN_ACTIONS } from '../../common/constants';

@Wizard(SCENES.add_server)
export class AddServerScene {

    @WizardStep(1)
    async step1(@Context() ctx) {
        await ctx.reply(BOT_MESSAGES.ADD_NEW_SERVER, {
            parse_mode: 'html',
        });

        // Get initial data
        // const { chatID, telegramNickname } = ctx?.wizard?.state;

        // // Add store 'userData' to collect entered user's data
        // ctx.wizard.state.userData = {};
        // ctx.wizard.state.userData.chatID = chatID;
        // ctx.wizard.state.userData.telegramNickname = telegramNickname;

        // const keyboard = [
        //     [
        //         Markup.button.callback(
        //             BOT_MESSAGES.BTN_TITLE.OK,
        //             TELEGRAM_BTN_ACTIONS.OK,
        //         ),
        //         Markup.button.callback(
        //             BOT_MESSAGES.BTN_TITLE.CANCEL,
        //             TELEGRAM_BTN_ACTIONS.CANCEL,
        //         ),
        //     ],
        // ];
        // await ctx.reply(
        //     'enter username',
        //     Markup.inlineKeyboard(keyboard),
        // );

        ctx.wizard.next();
    }

    @WizardStep(2)
    async step2(@Context() ctx) {
        const server_name: string = ctx?.message?.text;
        await ctx.reply(`your choosen server name is: ${server_name} \nnow enter your server API url`);

        ctx.scene.state.server_name = server_name;

        // console.log('firstName', firstName);
        // Get action on clicked btn from prev step
        // const selectedAction: string = ctx?.update?.callback_query?.data;

        // // If user did not click on btn, return it to prev step
        // if (!selectedAction) {
        //     await ctx.reply(BOT_MESSAGES.ERROR.CHECK_BTN);

        //     return;
        // }

        // // User clicked on Cancel btn
        // if (selectedAction === TELEGRAM_BTN_ACTIONS.CANCEL) {
        //     await ctx.reply(BOT_MESSAGES.CANCEL_REGISTRATION);

        //     return ctx.scene.leave();
        // }

        // // Ask user enter his first name
        // await ctx.reply(BOT_MESSAGES.ENTER_FIRST_NAME);

        // Go to next step
        ctx.wizard.next();
    }

    @WizardStep(3)
    async step3(@Context() ctx) {
        const server_api: string = ctx?.message?.text;

        ctx.scene.state.server_api = server_api;

        const keyboard = [
            [
                Markup.button.callback(
                    BOT_MESSAGES.BTN_TITLE.OK,
                    TELEGRAM_BTN_ACTIONS.OK,
                ),
            ],
            [
                Markup.button.callback(
                    BOT_MESSAGES.BTN_TITLE.EDIT,
                    TELEGRAM_BTN_ACTIONS.EDIT,
                ),
            ],
            [
                Markup.button.callback(
                    BOT_MESSAGES.BTN_TITLE.CANCEL,
                    TELEGRAM_BTN_ACTIONS.CANCEL,
                ),
            ]
        ];
        await ctx.reply(
            `your server details is:\nserver API: <code>${server_api}</code>\nserver Name: <code>${ctx.scene.state.server_name}</code>\n\n`,
            {
                parse_mode: 'html',
            }
        );
        await ctx.reply(
            `are you sure to build this server?`,
            Markup.inlineKeyboard(keyboard),
            {
                parse_mode: 'html',
            }
        );

        // Go to next step
        ctx.wizard.next();
    }

    @WizardStep(4)
    async step4(@Context() ctx) {
        // Get action on clicked btn from prev step
        const selectedAction: string = ctx?.update?.callback_query?.data;
        if (selectedAction) {
            if (selectedAction === TELEGRAM_BTN_ACTIONS.OK) {
                const { server_api, server_name } = ctx.scene.state;
                console.log('server_api', server_api);
                console.log('server_name', server_name);
                ctx.reply('ok');
            }
            if (selectedAction === TELEGRAM_BTN_ACTIONS.EDIT) {
                console.log('cancel');
                ctx.reply('done!');
                // send user to step
                ctx.wizard.selectStep(0);
                await ctx.wizard.steps[0](ctx);
            }
            if (selectedAction === TELEGRAM_BTN_ACTIONS.CANCEL) {
                ctx.scene.leave();
                ctx.reply('process was canceled');
            }
        }

    }
}