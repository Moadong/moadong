import "dotenv/config";
import { Client, GatewayIntentBits, Partials } from "discord.js";
import { startScheduler } from "./scheduler";
import { registerMentionHandler } from "./discord/mention";

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

if (!DISCORD_TOKEN) {
  console.error("DISCORD_TOKEN 환경 변수가 설정되지 않았습니다.");
  process.exit(1);
}

const requiredEnvVars = [
  "MP_SERVICE_ACCOUNT",
  "MP_SERVICE_SECRET",
  "MP_PROJECT_ID",
  "DISCORD_CHANNEL_ID",
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    console.error(key + " 환경 변수가 설정되지 않았습니다.");
    process.exit(1);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Channel],
});

client.once("ready", () => {
  console.log("로그인 완료:", client.user?.tag);
  startScheduler(client);
});

registerMentionHandler(client);

client.login(DISCORD_TOKEN).catch((err) => {
  console.error("Discord 로그인 실패:", err);
  process.exit(1);
});
