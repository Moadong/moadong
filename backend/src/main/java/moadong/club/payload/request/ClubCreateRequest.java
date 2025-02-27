package moadong.club.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ClubCreateRequest(
    @NotBlank
    @Size(min = 1, max = 10)
    String name,
    @NotBlank
    String classification,
    @NotBlank
    String division
) {

}
