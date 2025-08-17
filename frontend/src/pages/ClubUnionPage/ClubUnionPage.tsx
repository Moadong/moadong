import Header from '@/components/common/Header/Header';
import * as Styled from './ClubUnionPage.styles';
import { CLUB_UNION_MEMBERS } from '@/constants/CLUB_UNION_INFO';
import { PageContainer } from '@/styles/PageContainer.styles'; // 제공해주신 PageContainer 경로
import Footer from '@/components/common/Footer/Footer';

const ClubUnionPage = () => {
  return (
    <>
      <Header />
      <PageContainer>
        <Styled.Title>총동아리연합회 소개</Styled.Title>
        <Styled.ProfileGrid>
          {CLUB_UNION_MEMBERS.map((member) => (
            <Styled.ProfileCardContainer key={member.id}>
              <Styled.ProfileImage
                src={member.imageSrc}
                alt={`${member.name} 프로필`}
              />

              {/* 평소에 보이는 이름 배지 */}
              <Styled.NameBadge>{member.name}</Styled.NameBadge>

              {/* 호버 시 나타나는 정보 */}
              <Styled.InfoOverlay>
                <Styled.Role>{member.role}</Styled.Role>
                <Styled.Name>{member.name}</Styled.Name>
                <Styled.Description>{member.description}</Styled.Description>
                {member.contact && (
                  <Styled.Contact>{member.contact}</Styled.Contact>
                )}
              </Styled.InfoOverlay>
            </Styled.ProfileCardContainer>
          ))}
        </Styled.ProfileGrid>
      </PageContainer>
      <Footer />
    </>
  );
};

export default ClubUnionPage;
