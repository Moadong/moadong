import API_BASE_URL from "@/constants/api";
import { API_BASE } from "@/mocks/constants/clubApi";

const getApplicationOptions = async (clubId: string) => {
    try {
        const response = await fetch(`${API_BASE}/${clubId}/applications`);
        if (!response.ok) {
            console.error(`Failed to fetch options: ${response.statusText}`);
            throw new Error((await response.json()).message);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error('지원서 옵션 조회 중 오류가 발생했습니다.', error);
        throw error;
    }
};

export default getApplicationOptions;