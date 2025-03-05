import React, { useState } from 'react';
import Calendar from "@/pages/AdminPage/components/Calendar/Calendar";
import { parseRecruitmentPeriod } from "@/utils/stringToDate";


const RecruitEditTab = () => {
    // API 예상 데이터
    const recruitmentPeriod = "2025.01.04 00:00 ~ 2025.06.04 00:00";

    const { recruitmentStart: initialStart, recruitmentEnd: initialEnd } = parseRecruitmentPeriod(recruitmentPeriod);
    const [recruitmentStart, setRecruitmentStart] = useState<Date | null>(initialStart);
    const [recruitmentEnd, setRecruitmentEnd] = useState<Date | null>(initialEnd);
    

    return (
        <div>
            <h2>모집 기간 설정</h2>
            <Calendar
                recruitmentStart={recruitmentStart}
                recruitmentEnd={recruitmentEnd}
                onChangeStart={setRecruitmentStart}
                onChangeEnd={setRecruitmentEnd}
            />
        </div>
    );
};

export default RecruitEditTab;
