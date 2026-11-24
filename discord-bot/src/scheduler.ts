import cron from "node-cron";
import { Client, EmbedBuilder, TextChannel } from "discord.js";
import {
  getDAU,
  getTotalUsers,
  getPageStats,
  getEventCount,
} from "./mixpanel/queries";

const CHANNEL_ID = process.env.DISCORD_CHANNEL_ID ?? "";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return Math.round(seconds) + "초";
  return Math.floor(seconds / 60) + "분 " + Math.round(seconds % 60) + "초";
}

async function sendDailyReport(client: Client): Promise<void> {
  const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel | undefined;
  if (!channel) {
    console.error("일간 리포트: 채널을 찾을 수 없습니다.", CHANNEL_ID);
    return;
  }

  const yesterday = daysAgo(1);

  const [dau, total, mainStats] = await Promise.all([
    getDAU(yesterday),
    getTotalUsers(),
    getPageStats("main", yesterday, yesterday),
  ]);

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📊 모아동 일간 리포트")
    .setDescription(
      yesterday.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) + " 기준"
    )
    .addFields(
      { name: "👤 어제 DAU", value: dau.toLocaleString() + "명", inline: true },
      { name: "👥 누적 사용자", value: total.toLocaleString() + "명", inline: true },
      { name: "🏠 메인 PV", value: mainStats.pv.toLocaleString() + "회", inline: true }
    )
    .setTimestamp();

  await channel.send({ embeds: [embed] });
  console.log("일간 리포트 전송 완료");
}

async function sendWeeklyReport(client: Client): Promise<void> {
  const channel = client.channels.cache.get(CHANNEL_ID) as TextChannel | undefined;
  if (!channel) {
    console.error("주간 리포트: 채널을 찾을 수 없습니다.", CHANNEL_ID);
    return;
  }

  const today = new Date();
  const sevenDaysAgo = daysAgo(7);

  const pages = ["main", "club_detail", "subscriptions", "admin_statistics"];
  const pageStats = await Promise.all(
    pages.map((p) => getPageStats(p, sevenDaysAgo, today))
  );

  const applyCount = await getEventCount(
    "Application Form Submitted",
    sevenDaysAgo,
    today
  );

  const pageLabels: Record<string, string> = {
    main: "🏠 메인",
    club_detail: "🏷️ 동아리 상세",
    subscriptions: "🔔 구독 목록",
    admin_statistics: "📈 관리자 통계",
  };

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📈 모아동 주간 리포트")
    .setDescription(
      sevenDaysAgo.toLocaleDateString("ko-KR") +
        " ~ " +
        today.toLocaleDateString("ko-KR") +
        " (최근 7일)"
    );

  pages.forEach((page, i) => {
    const stats = pageStats[i];
    const label = pageLabels[page] ?? page;
    embed.addFields({
      name: label,
      value:
        "PV: **" + stats.pv.toLocaleString() + "회** · " +
        "순방문: **" + stats.unique.toLocaleString() + "명** · " +
        "평균 체류: **" + formatDuration(stats.avgDuration) + "**",
      inline: false,
    });
  });

  embed
    .addFields({
      name: "📝 지원서 제출",
      value: applyCount.toLocaleString() + "건",
      inline: true,
    })
    .setTimestamp();

  await channel.send({ embeds: [embed] });
  console.log("주간 리포트 전송 완료");
}

export function startScheduler(client: Client): void {
  // 매일 KST 09:00 (UTC 00:00)
  cron.schedule("0 0 * * *", () => {
    console.log("일간 리포트 스케줄 실행");
    sendDailyReport(client).catch(console.error);
  });

  // 매주 월요일 KST 09:00 (UTC 00:00)
  cron.schedule("0 0 * * 1", () => {
    console.log("주간 리포트 스케줄 실행");
    sendWeeklyReport(client).catch(console.error);
  });

  console.log("스케줄러 등록 완료: 일간(매일 09:00 KST), 주간(매주 월요일 09:00 KST)");
}
