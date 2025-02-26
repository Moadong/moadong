import React, { useState } from "react";
import InputField from "@/components/InputField/InputField";

const ClubInfoEditTab = () => {
    const [clubName, setClubName] = useState("");
    const [clubPresidentName, setClubPresidentName] = useState("");
    const [introduction, setIntroduction] = useState("");
    const [telephoneNumber, setTelephoneNumber] = useState("");

    return (
        <div>
            {/* 동아리 명 */}
            <InputField
                label="동아리 명"
                placeholder="동아리 명을 입력해주세요"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                onClear={() => setClubName("")}
                maxLength={80}
                showMaxChar={true}
            />

            <InputField
                label="회장 정보"
                placeholder="동아리 대표의 이름을 입력해주세요"
                type="text"
                value={clubPresidentName}
                onChange={(e) => setClubPresidentName(e.target.value)}
                onClear={() => setClubPresidentName("")}
                maxLength={5}
            />

            <InputField
                placeholder="전화번호를 입력해주세요"
                type="text"
                maxLength={13}
                value={telephoneNumber}
                onChange={(e) => setTelephoneNumber(e.target.value)}
                onClear={() => setTelephoneNumber("")}
            />

            <InputField
                label="한줄소개"
                placeholder="한줄소개를 입력해주세요"
                type="text"
                maxLength={40}
                showMaxChar={true}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
                onClear={() => setIntroduction("")}
            />
        </div>
    );
};

export default ClubInfoEditTab;
