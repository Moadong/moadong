package moadong.integration.notion.payload.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record NotionTokenApiResponse(
        @JsonProperty("access_token") String accessToken,
        @JsonProperty("workspace_name") String workspaceName,
        @JsonProperty("workspace_id") String workspaceId
) {
}
