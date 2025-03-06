import { MyButton } from './MyButton';

const meta = {
  title: 'MyComponent/MyButton',
  component: MyButton,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};

export default meta;

export const Primary = {
  args: {
    children: 'Button',
    backgroundColor: '#fff',
  },
};

export const Secondary = {
  args: {
    children: 'Button',
    backgroundColor: 'white',
  },
  argTypes: {
    backgroundColor: { control: 'color' },
  },
};
