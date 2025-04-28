import { useCallback, useRef, useState } from 'react';
import { useUploadClubLogo, useDeleteClubLogo } from '@/hooks/queries/club/useClubLogo';
import { useAdminClubContext } from '@/context/AdminClubContext';
import { MAX_FILE_SIZE } from '@/constants/uploadLimit';

...

const { clubId } = useAdminClubContext();
const uploadMutation = useUploadClubLogo(clubId!);
const deleteMutation = useDeleteClubLogo(clubId!);

const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
        alert('파일 크기가 10MB를 초과합니다.');
        return;
    }

    uploadMutation.mutate(file, {
        onError: () => alert('로고 업로드 실패'),
    });
}, [uploadMutation]);

const handleDeleteClick = useCallback(() => {
    if (!window.confirm('정말 로고를 초기화하시겠습니까?')) return;

    deleteMutation.mutate(undefined, {
        onError: () => alert('로고 초기화 실패'),
    });
}, [deleteMutation]);
