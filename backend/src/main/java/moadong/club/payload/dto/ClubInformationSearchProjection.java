package moadong.club.payload.dto;

public interface ClubInformationSearchProjection {
    String getLogo();
    String getIntroduction();

    static ClubInformationSearchProjection empty() {
        return new ClubInformationSearchProjection() {
            @Override
            public String getLogo() {
                return "";
            }

            @Override
            public String getIntroduction() {
                return "";
            }
        };
    }
}
