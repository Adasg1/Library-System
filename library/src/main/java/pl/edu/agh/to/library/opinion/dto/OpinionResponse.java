package pl.edu.agh.to.library.opinion.dto;

import pl.edu.agh.to.library.opinion.Opinion;

public record OpinionResponse(
        int opinionId,
        String content,
        int likes,
        int dislikes,
        String nick,
        int userId,
        int bookId,
        String bookTitle,
        String userReaction
) {
    public static OpinionResponse from(Opinion opinion, String reaction) {
        return new OpinionResponse(
                opinion.getOpinionId(),
                opinion.getContent(),
                opinion.getLikes(),
                opinion.getDislikes(),
                opinion.getUser().getDisplayName(),
                opinion.getUser().getUserId(),
                opinion.getBook().getBookId(),
                opinion.getBook().getTitle(),
                reaction
        );
    }

    public static OpinionResponse from(Opinion opinion) {
        return from(opinion, "NONE");
    }
}
