import * as Styled from './SettingsCard.styles';

interface SettingsCardItem {
  label: string;
  onClick: () => void;
}

interface SettingsCardProps {
  category?: string;
  items: SettingsCardItem[];
}

const SettingsCard = ({ category, items }: SettingsCardProps) => {
  return (
    <Styled.Card>
      {category && (
        <Styled.CategoryLabel>{category}</Styled.CategoryLabel>
      )}
      <Styled.ItemList>
        {items.map((item) => (
          <Styled.Item key={item.label} onClick={item.onClick}>
            <Styled.ItemLabel>{item.label}</Styled.ItemLabel>
            <Styled.ChevronIcon />
          </Styled.Item>
        ))}
      </Styled.ItemList>
    </Styled.Card>
  );
};

export default SettingsCard;
