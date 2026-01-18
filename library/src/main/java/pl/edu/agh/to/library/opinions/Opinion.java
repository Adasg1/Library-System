package pl.edu.agh.to.library.opinions;

import jakarta.persistence.*;
import pl.edu.agh.to.library.book.Book;
import pl.edu.agh.to.library.opinion_reactions.OpinionReaction;
import pl.edu.agh.to.library.user.User;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name="opinions", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"book_id", "user_id"})
})
public class Opinion {

    @Id
    @GeneratedValue
    private int opinionId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    private int likes = 0;

    private int dislikes = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    private Book book;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(
            mappedBy = "opinion",
            fetch = FetchType.LAZY,
            cascade = CascadeType.REMOVE,
            orphanRemoval = true
    )
    private Set<OpinionReaction> reactions;

    public Opinion(){}

    public Opinion(String content, Book book, User user){
        this.content = content;
        this.book = book;
        this.user = user;
        this.reactions = new HashSet<>();
    }

    public int getOpinionId() {
        return opinionId;
    }

    public String getContent() {
        return content;
    }

    public int getLikes() {
        return likes;
    }

    public int getDislikes() {
        return dislikes;
    }

    public Book getBook() {
        return book;
    }

    public User getUser() {
        return user;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setLikes(int likes) {
        this.likes = likes;
    }

    public void setDislikes(int dislikes) {
        this.dislikes = dislikes;
    }

    public Set<OpinionReaction> getReactions() {
        return reactions;
    }
}
