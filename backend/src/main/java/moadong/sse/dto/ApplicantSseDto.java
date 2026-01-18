package moadong.sse.dto;

import lombok.Data;
import moadong.sse.enums.ApplicantEventType;

@Data
public class ApplicantSseDto {
    private String clubId;
    private ApplicantEventType event;
    private Object data;
}
