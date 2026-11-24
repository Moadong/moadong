import {
  Client,
  Message,
  EmbedBuilder,
  TextChannel,
} from "discord.js";
import {
  getDAU,
  getTotalUsers,
  getPageStats,
  getEventCount,
} from "../mixpanel/queries";

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return Math.round(seconds) + "초";
  return Math.floor(seconds / 60) + "분 " + Math.round(seconds % 60) + "초";
}

function helpEmbed(): EmbedBuilder {
  return new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("📖 모아동 봇 사용법")
    .setDescription("@멘션 후 아래 키워드를 입력하세요")
    .addFields(
      { name: "오늘 / 신규", value: "오늘 DAU 조회", inline: true },
      { name: "어제", value: "어제 DAU 조회", inline: true },
      { name: "누적 / 전체", value: "전체 사용자 수 조회", inline: true },
      { name: "메인 / main", value: "메인 페이지 7일 통계", inline: true },
      {
        name: "동아리 상세 / club_detail",
        value: "동아리 상세 페이지 7일 통계",
        inline: true,
      },
      {
        name: "지원 / 지원서",
        value: "지원서 제출 수 (7일)",
        inline: true,
      }
    );
}

export function registerMentionHandler(client: Client): void {
  client.on("messageCreate", async (message: Message) => {
    if (message.author.bot) return;
    if (!message.mentions.has(client.user!)) return;

    const content = message.content.toLowerCase();
    const today = new Date();
    const yesterday = daysAgo(1);
    const sevenDaysAgo = daysAgo(7);

    try {
      let embed: EmbedBuilder;

      if (content.includes("신규") || content.includes("오늘")) {
        const dau = await getDAU(today);
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("👤 오늘 DAU")
          .setDescription("오늘 활성 사용자: **" + dau.toLocaleString() + "명**")
          .setTimestamp();
      } else if (content.includes("어제")) {
        const dau = await getDAU(yesterday);
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("👤 어제 DAU")
          .setDescription("어제 활성 사용자: **" + dau.toLocaleString() + "명**")
          .setTimestamp();
      } else if (content.includes("누적") || content.includes("전체")) {
        const total = await getTotalUsers();
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("👥 누적 사용자")
          .setDescription("전체 사용자 수: **" + total.toLocaleString() + "명**")
          .setTimestamp();
      } else if (content.includes("메인") || content.includes("main")) {
        const stats = await getPageStats("main", sevenDaysAgo, today);
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("🏠 메인 페이지 통계 (최근 7일)")
          .addFields(
            {
              name: "총 페이지뷰",
              value: stats.pv.toLocaleString() + "회",
              inline: true,
            },
            {
              name: "순 방문자",
              value: stats.unique.toLocaleString() + "명",
              inline: true,
            },
            {
              name: "평균 체류시간",
              value: formatDuration(stats.avgDuration),
              inline: true,
            }
          )
          .setTimestamp();
      } else if (
        content.includes("동아리 상세") ||
        content.includes("club_detail")
      ) {
        const stats = await getPageStats("club_detail", sevenDaysAgo, today);
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("🏷️ 동아리 상세 페이지 통계 (최근 7일)")
          .addFields(
            {
              name: "총 페이지뷰",
              value: stats.pv.toLocaleString() + "회",
              inline: true,
            },
            {
              name: "순 방문자",
              value: stats.unique.toLocaleString() + "명",
              inline: true,
            },
            {
              name: "평균 체류시간",
              value: formatDuration(stats.avgDuration),
              inline: true,
            }
          )
          .setTimestamp();
      } else if (content.includes("지원서") || content.includes("지원")) {
        const count = await getEventCount(
          "Application Form Submitted",
          sevenDaysAgo,
          today
        );
        const clicked = await getEventCount(
          "Club Apply Button Clicked",
          sevenDaysAgo,
          today
        );
        embed = new EmbedBuilder()
          .setColor(0x5865f2)
          .setTitle("📝 지원 현황 (최근 7일)")
          .addFields(
            {
              name: "지원 버튼 클릭",
              value: clicked.toLocaleString() + "회",
              inline: true,
            },
            {
              name: "지원서 제출",
              value: count.toLocaleString() + "건",
              inline: true,
            }
          )
          .setTimestamp();
      } else {
        embed = helpEmbed();
      }

      await (message.channel as TextChannel).send({ embeds: [embed] });
    } catch (err) {
      console.error("멘션 핸들러 오류:", err);
      await (message.channel as TextChannel).send(
        "❌ 데이터를 가져오는 중 오류가 발생했습니다."
      );
    }
  });
}
