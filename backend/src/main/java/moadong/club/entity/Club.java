package moadong.club.entity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import moadong.club.enums.ClubState;
import moadong.club.payload.request.ClubInfoRequest;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("clubs")
@AllArgsConstructor
@Getter
public class Club {

    @Id
    private String id;

    @NotNull
    @Column(length = 20)
    private String name;

    @NotNull
    @Column(length = 20)
    private String category;

    @NotNull
    @Column(length = 20)
    private String division;

    @Enumerated(EnumType.STRING)
    @NotNull
    private ClubState state;

    public Club() {
        this.name = "";
        this.category = "";
        this.division = "";
        this.state = ClubState.UNAVAILABLE;
    }

    public void update(ClubInfoRequest request) {
        this.name = request.name();
        this.category = request.category();
        this.division = request.division();
        this.state = ClubState.AVAILABLE;
    }
}
