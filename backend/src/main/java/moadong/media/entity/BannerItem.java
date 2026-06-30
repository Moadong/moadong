package moadong.media.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BannerItem {

    private String id;

    private String imageUrl;

    private String linkTo;

    private String alt;
}
