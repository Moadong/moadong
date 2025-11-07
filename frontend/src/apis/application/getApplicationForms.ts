import API_BASE_URL from "@/constants/api";

const getApplicationForms = async (clubId: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/club/${clubId}/apply`);
        if (!response.ok) {
            console.error(`Failed to fetch options: ${response.statusText}`);
            throw new Error((await response.json()).message);
        }
        const result = await response.json();
        const forms = Array.isArray(result?.data?.forms) ? result.data.forms : [];
        return forms.map((form: { id: string; title: string }) => ({
            id: form.id,
            title: form.title,
        }));
    } catch (error) {
        console.error('지원서 옵션 조회 중 오류가 발생했습니다.', error);
        throw error;
    }
};

export default getApplicationForms;