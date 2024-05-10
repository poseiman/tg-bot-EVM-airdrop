"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = exports.handleAirdrop = exports.addressCheck = exports.amountCheck = exports.addressAdd = exports.welcome = exports.commandList = void 0;
exports.commandList = [
    { command: 'start', description: 'Start the bot' },
    { command: 'address', description: 'Input or show your wallet address' },
    { command: 'amount', description: 'Check your claimable amount' },
    { command: 'help', description: 'About "botname"' },
];
const config_1 = require("../config");
const utils_1 = require("../utils");
const helper = __importStar(require("./helper"));
const welcome = async (chatId, username) => {
    const amount = await helper.start(chatId, username);
    const title = `This is the airdrop for historical Kleros users
You are logged in as @${username}
Your allocation is: ${amount}
You can check the balances and calculation on this page: ${config_1.webSite}
Reply with your address to receive tokens
`;
    const content = [[{ text: '✏️ Input wallet address', callback_data: 'wallet_register' }]];
    return { title, content };
};
exports.welcome = welcome;
const addressAdd = async (chatId, new_address) => {
    let title = '';
    let content;
    if (new_address && !(0, utils_1.validatorAddr)(new_address)) {
        title = `Invalid address, please register again`;
        content = [[{ text: `✏️ Register again`, callback_data: `wallet_register` }]];
    }
    else {
        const address = await helper.addressAddDB(chatId, new_address);
        if (address == new_address) {
            title = `You input this address: <a href='https://gnosisscan.io/address/${address}'>${address}</a>`;
            content = [[{ text: `💰 Get airdrop to this address`, callback_data: `airdrop` }]];
        }
        else {
            title = `Register failed, please register again your wallet address`;
            content = [[{ text: `✏️ Input wallet address`, callback_data: `wallet_register` }]];
        }
    }
    return { title, content };
};
exports.addressAdd = addressAdd;
const amountCheck = async (chatId) => {
    let title = '';
    let content;
    const info = await helper.amountCheckDB(chatId);
    if (info) {
        title = `Your allocation is: ${info.amount}`;
        content = [[{ text: `${info.address ? (!info.claimable ? '💰 Get airdrop' : '💸 You have already claimed') : '✏️ Input wallet address'}`, callback_data: `${info.address ? (!info.claimable ? 'airdrop' : 'ok') : 'wallet_register'}` }]];
    }
    else {
        title = `You have not login yet`;
        content = [[{ text: `👨‍💼 Login`, callback_data: `wallet_register` }]];
    }
    return { title, content };
};
exports.amountCheck = amountCheck;
const addressCheck = async (chatId) => {
    let title = '';
    let content;
    const address = await helper.addressCheckDB(chatId);
    if (address) {
        title = `You input this address: <a href='https://gnosisscan.io/address/${address}'>${address}</a>`;
        content = [[{ text: `💰 Get airdrop to this address`, callback_data: `airdrop` }]];
    }
    else {
        title = `You didn't register wallet address yet`;
        content = [[{ text: `✏️ Input wallet address`, callback_data: `wallet_register` }]];
    }
    return { title, content };
};
exports.addressCheck = addressCheck;
const handleAirdrop = async (chatId) => {
    let title = '';
    // let content: { text: string, callback_data: string }[][]
    const res = await helper.airdrop(chatId);
    if (res.tx) {
        title = `Transaction success`;
        const content = [[{ text: `🔎 View on explorer`, url: `https://gnosisscan.io/tx/${res.tx}` }]];
        return { title, content };
    }
    else if (res.error) {
        title = `Can't get airdrop`;
        const content = [[{ text: `💸 You have already claimed`, callback_data: 'ok' }]];
        return { title, content };
    }
    else {
        title = `Transaction failed`;
        const content = [[{ text: `Transaction failed`, callback_data: `start_menu` }]];
        return { title, content };
    }
};
exports.handleAirdrop = handleAirdrop;
const help = async () => {
    return {
        title: `
Welcome to Our Telegram Bot!

We're excited to have you here! This bot allows you to claim tokens from our channel, and we're happy to guide you through the process.

Getting Started

To begin, simply select the "Start" option from the menu list. You'll then be prompted to choose whether you want to start the claiming process. Please follow the prompts to input your wallet address, and our bot will guide you through the rest of the process.

Claiming Tokens

Once you've entered your wallet address, our bot will check its validity and provide a button to let you receive the tokens. Click this button, and we'll send you our tokens according to our allocation.

Important Note

If you've already claimed these tokens, you'll see a message saying "You already claimed." Don't worry, we'll let you know when new tokens are available for claiming.

Checking Your Wallet Status

If you want to check your wallet status, simply click on the "Address" option from the menu list. You'll see your current balance and any outstanding tokens.

Viewing Your Allocation

To check your token allocation, click on the "Amount" option from the menu list. You'll see how many tokens you've been allocated and how many are still available for claiming.

That's it! We're happy to have you on board and look forward to sending you our tokens.`
    };
};
exports.help = help;
//# sourceMappingURL=index.js.map