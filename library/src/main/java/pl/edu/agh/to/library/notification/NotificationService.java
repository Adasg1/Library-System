package pl.edu.agh.to.library.notification;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import pl.edu.agh.to.library.user.User;

@Service
public class NotificationService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String senderEmail;

    public NotificationService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendBookAvailableNotification(User user, String bookTitle) {
        System.out.println("Próba wysyłki z adresu: " + senderEmail);
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(senderEmail);
            message.setTo(user.getUsername());
            message.setSubject("Książka dostępna w bibliotece Mole Książkowe");
            message.setText(String.format(
                    "Cześć %s,\n\nMamy dobrą wiadomość! Książka '%s' jest już dostępna. " +
                            "Została przypisana do Twojej rezerwacji. Masz 3 dni na odbiór.",
                    user.getFirstName(), bookTitle
            ));

            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Nie udało się wysłać powiadomienia e-mail: " + e.getMessage());
        }
    }
}