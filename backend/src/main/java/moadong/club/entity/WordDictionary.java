package moadong.club.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Document("word_dictionary")
public class WordDictionary {
    
    @Id
    private String id;
    
    @Indexed(unique = true)
    @Field("standardWord")
    private String standardWord;  // 표준단어
    
    @Field("inputWords")
    private List<String> inputWords;  // 해당 표준단어에 매핑되는 모든 입력단어들
}
