import { mixpanelQueryApi, mixpanelEngageApi, PROJECT_ID } from "./client";

/** 날짜를 "YYYY-MM-DD" 형식으로 반환 */
function fmt(d: Date): string {
  return d.toISOString().split("T")[0];
}

/**
 * 1. 특정 날짜의 DAU
 *    'Page Viewed' 이벤트 unique user 수
 */
export async function getDAU(date: Date): Promise<number> {
  const dateStr = fmt(date);
  const { data } = await mixpanelQueryApi.get("/segmentation", {
    params: {
      project_id: PROJECT_ID,
      event: "Page Viewed",
      from_date: dateStr,
      to_date: dateStr,
      type: "unique",
      unit: "day",
    },
  });
  const values: Record<string, number> =
    data?.data?.values?.["Page Viewed"] ?? {};
  const counts = Object.values(values);
  return counts.length > 0 ? (counts[0] as number) : 0;
}

/**
 * 2. 전체 사용자 수
 *    Mixpanel engage API 사용
 */
export async function getTotalUsers(): Promise<number> {
  const { data } = await mixpanelEngageApi.get("/engage", {
    params: {
      project_id: PROJECT_ID,
      include_all_users: true,
    },
  });
  return (data?.total as number) ?? 0;
}

/**
 * 3. 특정 페이지의 PV(total), 순방문(unique), 평균 체류시간
 *    - PV: Page Viewed 이벤트, page_name 필터
 *    - 평균 체류시간: Page Left 이벤트의 duration_seconds 평균
 */
export async function getPageStats(
  pageName: string,
  fromDate: Date,
  toDate: Date
): Promise<{ pv: number; unique: number; avgDuration: number }> {
  const from = fmt(fromDate);
  const to = fmt(toDate);
  const pageFilter = 'properties["page_name"] == "' + pageName + '"';

  const [pvRes, uniqueRes, durationRes] = await Promise.all([
    mixpanelQueryApi.get("/segmentation", {
      params: {
        project_id: PROJECT_ID,
        event: "Page Viewed",
        from_date: from,
        to_date: to,
        type: "general",
        unit: "day",
        where: pageFilter,
      },
    }),
    mixpanelQueryApi.get("/segmentation", {
      params: {
        project_id: PROJECT_ID,
        event: "Page Viewed",
        from_date: from,
        to_date: to,
        type: "unique",
        unit: "day",
        where: pageFilter,
      },
    }),
    mixpanelQueryApi.get("/segmentation", {
      params: {
        project_id: PROJECT_ID,
        event: "Page Left",
        from_date: from,
        to_date: to,
        type: "average",
        on: 'properties["duration_seconds"]',
        unit: "day",
        where: pageFilter,
      },
    }),
  ]);

  type SegResponse = {
    data: { data?: { values?: Record<string, Record<string, number>> } };
  };

  const sumValues = (res: SegResponse, eventName: string): number => {
    const values: Record<string, number> =
      res.data?.data?.values?.[eventName] ?? {};
    return Object.values(values).reduce((a, b) => a + b, 0);
  };

  const avgValues = (res: SegResponse, eventName: string): number => {
    const values: Record<string, number> =
      res.data?.data?.values?.[eventName] ?? {};
    const nums = Object.values(values).filter((v) => v > 0);
    return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
  };

  return {
    pv: sumValues(pvRes, "Page Viewed"),
    unique: sumValues(uniqueRes, "Page Viewed"),
    avgDuration: avgValues(durationRes, "Page Left"),
  };
}

/**
 * 4. 특정 이벤트 발생 수
 */
export async function getEventCount(
  eventName: string,
  fromDate: Date,
  toDate: Date
): Promise<number> {
  const { data } = await mixpanelQueryApi.get("/segmentation", {
    params: {
      project_id: PROJECT_ID,
      event: eventName,
      from_date: fmt(fromDate),
      to_date: fmt(toDate),
      type: "general",
      unit: "day",
    },
  });
  const values: Record<string, number> =
    data?.data?.values?.[eventName] ?? {};
  return Object.values(values).reduce((a, b) => a + b, 0);
}
