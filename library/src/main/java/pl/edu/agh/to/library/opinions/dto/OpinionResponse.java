package pl.edu.agh.to.library.opinions.dto;

import pl.edu.agh.to.library.opinions.Opinion;
import pl.edu.agh.to.library.user.User;

public record OpinionResponse(
        int opinionId,
        String content,
        int likes,
        int dislikes,
        String nick
) {
    public static OpinionResponse from(Opinion opinion) {
        return new OpinionResponse(
                opinion.getOpinionId(),
                opinion.getContent(),
                opinion.getLikes(),
                opinion.getDislikes(),
                opinion.getUser().getDisplayName()
        );
    }
}
