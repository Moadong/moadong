package moadong.integration.notion.entity;

import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document("notion_connections")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotionConnection {

    @Id
    private String userId;

    private String encryptedAccessToken;

    private String workspaceName;

    private String workspaceId;

    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    public void updateConnection(String encryptedAccessToken, String workspaceName, String workspaceId) {
        this.encryptedAccessToken = encryptedAccessToken;
        this.workspaceName = workspaceName;
        this.workspaceId = workspaceId;
        this.updatedAt = LocalDateTime.now();
    }
}
