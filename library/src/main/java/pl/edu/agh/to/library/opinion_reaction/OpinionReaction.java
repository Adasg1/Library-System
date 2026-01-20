package pl.edu.agh.to.library.opinion_reaction;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import pl.edu.agh.to.library.opinion.Opinion;
import pl.edu.agh.to.library.user.User;

@Entity
@Table(name="opinionReactions", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"opinion_id", "user_id"})
})
public class OpinionReaction {

    @Id
    @GeneratedValue
    @JsonIgnore
    private int reactionId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opinion_id", nullable = false)
    @JsonIgnore
    private Opinion opinion;

    private Reaction reaction;

    public OpinionReaction(){};

    public OpinionReaction(User user, Opinion opinion, Reaction reaction){
        this.user = user;
        this.opinion = opinion;
        this.reaction = reaction;
    };

    public Reaction getReaction() {
        return reaction;
    }

    public void setReaction(Reaction reaction) {
        this.reaction = reaction;
    }

    public int getReactionId() {
        return reactionId;
    }
}