import React, { useState } from "react";
import InputField from "@/components/InputField/InputField";

const ClubInfoEditTab = () => {
    const [name, setName] = useState(""); // 동아리 명 (clubName -> name)
    const [clubPresidentName, setClubPresidentName] = useState(""); // 회장 이름 (nickname -> clubPresidentName)
    const [introduction, setIntroduction] = useState(""); // 동아리 설명 (clubDescription -> description)
    const [telephoneNumber, setTelephoneNumber] = useState(""); // 전화번호 (phoneNumber -> telephoneNumber)

    return (
        <div>
            {/* 동아리 명 */}
            <InputField
                label="동아리 명"
                placeholder="동아리 명을 입력해주세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                showMaxChar={true}
            />

            {/* 회장 이름 */}
            <InputField
                label="회장 정보"
                placeholder="동아리 대표의 이름을 입력해주세요"
                type="text"
                value={clubPresidentName}
                maxLength={5}
                onChange={(e) => setClubPresidentName(e.target.value)}
            />

            {/* 전화번호 */}
            <InputField
                placeholder="전화번호를 입력해주세요"
                type="text"
                maxLength={13}
                value={telephoneNumber}
                onChange={(e) => setTelephoneNumber(e.target.value)}
            />



            {/* 한줄소개 */}
            <InputField
                label="한줄소개"
                placeholder="한줄소개를 입력해주세요"
                type="text"
                maxLength={40}
                showMaxChar={true}
                value={introduction}
                onChange={(e) => setIntroduction(e.target.value)}
            />
        </div>
    );
};

export default ClubInfoEditTab;
