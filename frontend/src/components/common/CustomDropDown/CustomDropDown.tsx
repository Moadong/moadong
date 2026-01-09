import React, { createContext, ReactNode, useContext } from 'react';
import * as Styled from './CustomDropDown.styles';

interface DropdownOption<TValue> {
  label: string;
  value: TValue;
}

interface CustomDropDownContextProps<TValue> {
  open: boolean;
  selected?: TValue;
  options: readonly DropdownOption<TValue>[];
  onToggle: (isOpen: boolean) => void;
  handleSelect: (value: TValue) => void;
}

interface CustomDropDownProps<TValue> {
  children: ReactNode;
  options: readonly DropdownOption<TValue>[];
  selected?: TValue;
  onSelect: (value: TValue) => void;
  open: boolean;
  onToggle: (isOpen: boolean) => void;
  style?: React.CSSProperties;
}

interface ItemProps<TValue> {
  value: TValue;
  children: ReactNode;
  style?: React.CSSProperties;
}

const CustomDropDownContext = createContext<
  CustomDropDownContextProps<any> | undefined
>(undefined);

const useDropDownContext = () => {
  const context = useContext(CustomDropDownContext);
  if (!context) {
    throw new Error(
      'useDropDownContext는 CustomDropDownContextProvider 내부에서 사용할 수 있습니다.',
    );
  }
  return context;
};

const Trigger = ({ children }: { children: ReactNode }) => {
  const { onToggle, open } = useDropDownContext();
  return (
    <div
      onClick={() => {
        onToggle(open);
      }}
    >
      {children}
    </div>
  );
};

interface MenuProps {
  children: ReactNode;
  top?: string;
  width?: string;
  right?: string;
}

const Menu = ({ children, top, width, right }: MenuProps) => {
  const { open } = useDropDownContext();
  return open ? (
    <Styled.OptionList role='listbox' $top={top} $width={width} $right={right}>
      {children}
    </Styled.OptionList>
  ) : null;
};

const Item = <TValue extends string | number = string>({
  value,
  children,
  style,
}: ItemProps<TValue>) => {
  const { selected, handleSelect } = useDropDownContext();
  return (
    <Styled.OptionItem
      role='option'
      $isSelected={value === selected}
      onClick={() => handleSelect(value)}
      style={style}
    >
      {children}
    </Styled.OptionItem>
  );
};

export function CustomDropDown<T extends string | number = string>({
  children,
  options,
  selected,
  onSelect,
  open,
  onToggle,
  style,
}: CustomDropDownProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onToggle(open);
  };

  const value = { open, selected, options, onToggle, handleSelect };

  return (
    <CustomDropDownContext.Provider value={value}>
      <Styled.DropDownWrapper style={style}>{children}</Styled.DropDownWrapper>
    </CustomDropDownContext.Provider>
  );
}

CustomDropDown.Trigger = Trigger;
CustomDropDown.Menu = Menu;
CustomDropDown.Item = Item;
