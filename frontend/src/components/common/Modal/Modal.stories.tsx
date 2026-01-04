import type { Meta, StoryObj } from '@storybook/react';
import Modal from './PortalModal';
import { useState } from 'react';
import Button from '../Button/Button';

const meta = {
    title: 'Components/Common/Modal',
    component: Modal,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        isOpen: {
            control: 'boolean',
            description: '모달의 열림/닫힘 상태를 제어합니다.',
        },
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
        onBackdropClick: {
            action: 'backdrop clicked',
            description: '모달 배경 클릭 시 호출되는 함수입니다.',
        },
    },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 모달 스토리
export const Default: Story = {
    args: {
        isOpen: true,
        title: '기본 모달',
        description: '이것은 기본 모달입니다.',
        children: '모달 내용이 여기에 들어갑니다.',
        onClose: () => { },
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.isOpen);

        const handleClose = () => {
            setIsOpen(false);
            args.onClose();
        };

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
                <Modal {...args} isOpen={isOpen} onClose={handleClose} />
            </>
        );
    },
};

// 설명이 없는 모달
export const WithoutDescription: Story = {
    args: {
        isOpen: true,
        title: '설명 없는 모달',
        children: '설명 없이 제목과 내용만 있는 모달입니다.',
        onClose: () => { },
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.isOpen);

        const handleClose = () => {
            setIsOpen(false);
            args.onClose();
        };

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
                <Modal {...args} isOpen={isOpen} onClose={handleClose} />
            </>
        );
    },
};

// 내용이 긴 모달
export const LongContent: Story = {
    args: {
        isOpen: true,
        title: '내용이 긴 모달',
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
            </div>
        ),
        onClose: () => { },
    },
    render: (args) => {
        const [isOpen, setIsOpen] = useState(args.isOpen);

        const handleClose = () => {
            setIsOpen(false);
            args.onClose();
        };

        return (
            <>
                <Button onClick={() => setIsOpen(true)}>모달 열기</Button>
                <Modal {...args} isOpen={isOpen} onClose={handleClose} />
            </>
        );
    },
};
