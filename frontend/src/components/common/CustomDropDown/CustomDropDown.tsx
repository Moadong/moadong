import React, {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from 'react';
import * as Styled from './CustomDropDown.styles';

interface DropdownOption<TValue> {
  label: string;
  value: TValue;
}

interface CustomDropDownContextProps<TValue> {
  open: boolean;
  selected: TValue;
  options: DropdownOption<TValue>[];
  onToggle: () => void;
  handleSelect: (value: TValue) => void;
}

interface CustomDropDownProps<TValue>
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onSelect'> {
  children: ReactNode;
  options: DropdownOption<TValue>[];
  selected?: TValue;
  onSelect: (value: TValue) => void;
  open: boolean;
  onToggle: () => void;
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
  return <>{children}</>;
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
    <Styled.OptionList top={top} width={width} right={right}>
      {children}
    </Styled.OptionList>
  ) : null;
};

const Item = ({ value, children, style }: ItemProps<any>) => {
  const { selected, handleSelect } = useDropDownContext();
  return (
    <Styled.OptionItem
      isSelected={value === selected}
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
  ...rest
}: CustomDropDownProps<T>) {
  const handleSelect = (value: T) => {
    onSelect(value);
    onToggle();
  };

  const value = useMemo(
    () => ({ open, selected, options, onToggle, handleSelect }),
    [open, selected, options, onToggle, onSelect],
  );

  return (
    <CustomDropDownContext.Provider value={value}>
      <Styled.DropDownWrapper {...rest}>{children}</Styled.DropDownWrapper>
    </CustomDropDownContext.Provider>
  );
}

CustomDropDown.Trigger = Trigger;
CustomDropDown.Menu = Menu;
CustomDropDown.Item = Item;
