import http from 'k6/http';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { check, sleep, group } from "k6"; 

const BASE = __ENV.BASE_URL;
const PATH   = '/api/club/application';
const LOGIN_ID = __ENV.LOGIN_ID;
const LOGIN_PW = __ENV.LOGIN_PW;


export const options = {
    scenarios: {
        warmup: {
            executor: "constant-arrival-rate",
            rate: 10, 
            timeUnit: "1s",
            duration: "30s",
            preAllocatedVUs: 30, 
            maxVUs: 100,
            tags: { phase: "warmup" },
        },
        measure: {
            executor: "constant-arrival-rate", //RPS 고정 실행기
            rate: 20, //초당 요청 목표
            timeUnit: "1s", //1초 기준
            duration: "1m", //1분 동안 => 1분동안 1200요청
            preAllocatedVUs: 50, //시작 시 확보할 VU 슬롯
            maxVUs: 200, //늘릴 수 있는 VU 최대값
            tags: { phase: "measure" }
         },
         //무릎지점 찾기
        /*ramp: {
            executor: "ramping-arrival-rate", //RPS 목표를 단계적으로 바꾸는 실행기
            timeUnit: "1s",
            startRate: 10,
            preAllocatedVUs: 80, maxVUs: 400,
            startTime: "1m30s", //measure 종료 직후 시작
            stages: [
            { target: 30, duration: "1m" }, //1분동안 1800요청
            { target: 40, duration: "1m" }, //1분동안 2400요청
            //{ target: 50, duration: "1m" }, //1분동안 3200요청
            //{ target: 60, duration: "1m" }, //1분동안 4000요청
            ],
            tags: { phase: "ramp" },
        },*/
    },
    thresholds: { //본 측정만 합격/실패 판정
        "http_req_duration{phase:measure, mode:agg}": ["p(95)<1000"],
        "http_req_duration{phase:measure, mode:server}": ["p(95)<1000"],
        "http_req_failed{phase:measure, mode:agg}": ["rate<0.02"],
        "http_req_failed{phase:measure, mode:server}": ["rate<0.02"],
    },
    summaryTrendStats: ["count","min","med","p(90)","p(95)","p(99)","max"],
};

export function setup() {
    const loginUrl = `${BASE}/auth/user/login`;
    const loginBody = JSON.stringify({
        userId: LOGIN_ID,
        password: LOGIN_PW,
    });
    const loginHeader = { 
        accept: "*/*",
        "Content-Type": "application/json"
    };
    const loginResponse = http.post(loginUrl, loginBody, { headers: loginHeader });

    check(loginResponse, {
        "login: status is 200": (resp) => resp.status == 200
    });

    if (loginResponse.status >= 400) {
        throw new Error(`로그인 실패 (${loginResponse.status}): ${loginResponse.body}`);
    }

    const json = loginResponse.json();
    return json.data.accessToken;
}

export default function (authToken) {
    const requestHeader = {
        accept: "*/*",
        Authorization: `Bearer ${authToken}`,
        "Cache-Control": "no-cache", //중간 캐시 응답 재사용x
        Pragma: "no-cache",
    };

    //반복마다 호출 순서 교차 (캐시 편향 제거)
    if (__ITER % 2 === 0) {
        group("mode=agg", () => {
            const url = `${BASE}${PATH}?mode=agg`;
            const res = http.get(url, { headers: requestHeader, tags: { mode: "agg" } });
            check(res, { "agg: status is 200": (r) => r.status == 200 });
        });
        group("mode=server", () => {
            const url = `${BASE}${PATH}?mode=server`;
            const res = http.get(url, { headers: requestHeader, tags: { mode: "server" } });
            check(res, { "server: status is 200": (r) => r.status == 200 });
        });
    } else {
        group("mode=server", () => {
            const url = `${BASE}${PATH}?mode=server`;
            const res = http.get(url, { headers: requestHeader, tags: { mode: "server" } });
            check(res, { "server: status is 200": (r) => r.status == 200 });
        });
        group("mode=agg", () => {
            const url = `${BASE}${PATH}?mode=agg`;
            const res = http.get(url, { headers: requestHeader, tags: { mode: "agg" } });
            check(res, { "agg: status is 200": (r) => r.status == 200 });
        });
    }

    sleep(0.1);
}

export function handleSummary (data) {
    return {
        "summary.html": htmlReport(data),
    }
}
