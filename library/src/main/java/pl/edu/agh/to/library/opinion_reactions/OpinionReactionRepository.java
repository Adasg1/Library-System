package pl.edu.agh.to.library.opinion_reactions;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import pl.edu.agh.to.library.opinions.Opinion;

import java.util.Optional;

@Repository
public interface OpinionReactionRepository extends JpaRepository<OpinionReaction, Integer> {

    Optional<OpinionReaction> findByUser_UserIdAndOpinion_OpinionId(int useId, int opinionId);
}
