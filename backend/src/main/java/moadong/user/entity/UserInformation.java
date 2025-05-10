package moadong.user.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import moadong.global.annotation.Korean;
import moadong.global.annotation.PhoneNumber;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInformation {

    @Id
    private String id;

    @NotNull
    @Korean
    private String name;
    @PhoneNumber
    private String phoneNumber;

    public UserInformation(String name, String phoneNumber) {
        this.name = name;
        this.phoneNumber = phoneNumber;
    }
}
