package pl.edu.agh.to.library.opinion_reaction;


import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.opinion.Opinion;
import pl.edu.agh.to.library.opinion.OpinionService;
import pl.edu.agh.to.library.user.User;

import java.util.Optional;

@Service
public class OpinionReactionService {

    private final OpinionReactionRepository opinionReactionRepository;
    private final OpinionService opinionService;

    public OpinionReactionService(OpinionReactionRepository opinionReactionRepository, OpinionService opinionService) {
        this.opinionReactionRepository = opinionReactionRepository;
        this.opinionService = opinionService;
    }

    public OpinionReaction createOrUpdateReaction(User user, int opinionId, Reaction reaction){
        Opinion opinion = opinionService.getOpinionById(opinionId).orElseThrow();
        OpinionReaction or;
        Optional<OpinionReaction> current = opinionReactionRepository.findByUser_UserIdAndOpinion_OpinionId(
                user.getUserId(), opinion.getOpinionId());

        if (reaction != Reaction.NONE) {
            if (current.isPresent()) {
                or = current.get();
                or.setReaction(reaction);
            } else {
                or = new OpinionReaction(user, opinion, reaction);
            }
            OpinionReaction saved = opinionReactionRepository.save(or);
            opinionService.updateReactionValues(opinionId);
            return saved;
        } else {
            if (current.isPresent()){
                or = current.get();
                deleteReaction(or.getReactionId());
                opinionService.updateReactionValues(opinionId);
            }
            return new OpinionReaction(user,opinion,reaction);
        }
    }

    private boolean deleteReaction(int id) {
        if (opinionReactionRepository.existsById(id)) {
            opinionReactionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
