import React, { useState } from "react";
import InputField from "@/components/InputField/InputField";

const AccountEditTab = () => {
    const [username, setUsername] = useState(""); // 아이디
    const [password, setPassword] = useState(""); // 비밀번호

    return (
        <div>
            <h1>계정 정보 수정</h1>



            <InputField
                label="아이디"
                placeholder="아이디를 입력해주세요"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
            />

            <InputField
                label="비밀번호"
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                maxLength={20}
            />
        </div>
    );
};

export default AccountEditTab;
