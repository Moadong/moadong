import type { Meta, StoryObj } from '@storybook/react';
import ModalLayout from './ModalLayout';

const meta = {
    title: 'Components/Common/ModalLayout',
    component: ModalLayout,
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        onClose: {
            action: 'closed',
            description: '모달 닫기 버튼 클릭 시 호출되는 함수입니다.',
        },
        title: {
            control: 'text',
            description: '모달의 제목입니다.',
        },
        description: {
            control: 'text',
            description: '모달의 설명 텍스트입니다.', 
        },
        children: {
            control: 'text',
            description: '모달 내부에 렌더링될 컨텐츠입니다.',
        },
        width: {
            control: 'text',
            description: '모달의 너비를 설정합니다.',
        },
    },
} satisfies Meta<typeof ModalLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 모달 스토리
export const Default: Story = {
    args: {
        title: '기본 모달 레이아웃',
        description: '이것은 기본 모달 레이아웃입니다.',
        children: '모달 내용이 여기에 들어갑니다.',
        width: '400px',
    },
};

// 너비가 다른 모달 스토리
export const WideModal: Story = {
    args: {
        title: '넓은 모달 레이아웃',
        description: '이것은 너비가 600px인 모달 레이아웃입니다.',
        children: '모달 내용이 여기에 들어갑니다.',
        width: '600px',
    },
};

// 설명이 없는 모달 스토리
export const NoDescription: Story = {
    args: {
        title: '설명이 없는 모달 레이아웃',
        children: '설명 없이 제목과 내용만 있는 모달입니다.',
        width: '400px',
    },
};

// 내용이 긴 모달 스토리
export const LongContent: Story = {
    args: {
        onClose: () => { },
        title: '내용이 긴 모달 레이아웃',
        description: '스크롤이 필요한 경우를 테스트합니다.',
        children: (
            <div>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p style={{ marginTop: '16px' }}>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                    Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p style={{ marginTop: '16px' }}>
                    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,
                    eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
                <p style={{ marginTop: '16px' }}>
                    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti 
                    quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
                </p>

                <p style={{ marginTop: '16px' }}>
                    Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, 
                    omnis voluptas assumenda est, omnis dolor repellendus.
                </p>
            </div>
            ),
        width: '400px',
    },
};