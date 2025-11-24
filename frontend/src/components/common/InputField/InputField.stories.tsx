import type { Meta, StoryObj } from '@storybook/react';
import InputField from './InputField';
import { useState } from 'react';

const meta = {
    title: 'Components/Common/InputField',
    component: InputField,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        value: {
            control: 'text',
            description: '입력 필드의 값입니다.',
        },
        onChange: {
            action: 'changed',
            description: '값이 변경될 때 호출되는 함수입니다.',
        },
        onClear: {
            action: 'cleared',
            description: '삭제 버튼 클릭 시 호출되는 함수입니다.',
        },
        placeholder: {
            control: 'text',
            description: '입력 필드의 플레이스홀더입니다.',
        },
        label: {
            control: 'text',
            description: '입력 필드 상단에 표시되는 라벨입니다.',
        },
        type: {
            control: 'radio',
            options: ['text', 'password'],
            description: '입력 필드의 타입입니다.',
        },
        width: {
            control: 'text',
            description: '입력 필드의 너비입니다.',
        },
        disabled: {
            control: 'boolean',
            description: '비활성화 여부입니다.',
        },
        isError: {
            control: 'boolean',
            description: '에러 상태 여부입니다.',
        },
        isSuccess: {
            control: 'boolean',
            description: '성공 상태 여부입니다.',
        },
        helperText: {
            control: 'text',
            description: '하단에 표시되는 도움말 텍스트입니다 (에러 시 표시).',
        },
        showClearButton: {
            control: 'boolean',
            description: '삭제 버튼 표시 여부입니다.',
        },
        showMaxChar: {
            control: 'boolean',
            description: '최대 글자수 표시 여부입니다.',
        },
        maxLength: {
            control: 'number',
            description: '최대 글자수 제한입니다.',
        },
        readOnly: {
            control: 'boolean',
            description: '읽기 전용 여부입니다.',
        },
    },
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        placeholder: '텍스트를 입력하세요',
        width: '300px',
        value: '',
        onChange: () => { },
        onClear: () => { },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || '');
        return (
            <InputField
                {...args}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    args.onChange?.(e);
                }}
                onClear={() => {
                    setValue('');
                    args.onClear?.();
                }}
            />
        );
    },
};

export const WithLabel: Story = {
    args: {
        label: '이메일',
        placeholder: 'example@email.com',
        width: '300px',
        value: '',
        onChange: () => { },
        onClear: () => { },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || '');
        return (
            <InputField
                {...args}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    args.onChange?.(e);
                }}
                onClear={() => {
                    setValue('');
                    args.onClear?.();
                }}
            />
        );
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        label: '비밀번호',
        placeholder: '비밀번호를 입력하세요',
        width: '300px',
        value: '',
        onChange: () => { },
        onClear: () => { },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || '');
        return (
            <InputField
                {...args}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    args.onChange?.(e);
                }}
                onClear={() => {
                    setValue('');
                    args.onClear?.();
                }}
            />
        );
    },
};

export const ErrorState: Story = {
    args: {
        label: '닉네임',
        value: '이미 사용중인 닉네임입니다',
        isError: true,
        helperText: '이미 사용중인 닉네임입니다.',
        width: '300px',
        onChange: () => { },
        onClear: () => { },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || '');
        return (
            <InputField
                {...args}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    args.onChange?.(e);
                }}
                onClear={() => {
                    setValue('');
                    args.onClear?.();
                }}
            />
        );
    },
};
export const WithMaxLength: Story = {
    args: {
        label: '한줄 소개',
        placeholder: '20자 이내로 입력해주세요',
        maxLength: 20,
        showMaxChar: true,
        width: '300px',
        value: '',
        onChange: () => { },
        onClear: () => { },
    },
    render: (args) => {
        const [value, setValue] = useState(args.value || '');
        return (
            <InputField
                {...args}
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    args.onChange?.(e);
                }}
                onClear={() => {
                    setValue('');
                    args.onClear?.();
                }}
            />
        );
    },
};

export const Disabled: Story = {
    args: {
        label: '아이디',
        value: 'disabled_user',
        disabled: true,
        width: '300px',
        onChange: () => { },
        onClear: () => { },
    },
};
