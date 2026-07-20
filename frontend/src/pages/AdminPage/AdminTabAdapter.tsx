import useDevice from '@/hooks/useDevice';

interface AdminTabAdapterProps {
  desktop: React.ReactNode;
  mobile: React.ReactNode;
}

const AdminTabAdapter = ({ desktop, mobile }: AdminTabAdapterProps) => {
  const { isMobile, isTablet } = useDevice();
  return <>{isMobile || isTablet ? mobile : desktop}</>;
};

export default AdminTabAdapter;
