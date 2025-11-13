import API_BASE_URL from "@/constants/api";

const getApplicationOptions = async (clubId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
        if (!response.ok) {
            let message = response.statusText;
            try {
                const errorData = await response.json();
                if (errorData?.message) message = errorData.message;
            } catch {}
            console.error(`Failed to fetch options: ${message}`);
            throw new Error(message);
        }

        const result = await response.json();
        let forms: Array<{ id: string; title: string }> = [];
        if (result && result.data && Array.isArray(result.data.forms)) {
            forms = result.data.forms;
        }
        return forms;
    } catch (error) {
        console.error('지원서 옵션 조회 중 오류가 발생했습니다.', error);
        throw error;
    }
};

export default getApplicationOptions;