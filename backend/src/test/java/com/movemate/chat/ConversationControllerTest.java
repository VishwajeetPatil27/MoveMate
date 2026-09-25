package com.movemate.chat;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.movemate.chat.dto.CreateConversationRequest;
import com.movemate.chat.dto.SendMessageRequest;
import com.movemate.chat.entity.*;
import com.movemate.chat.repository.ConversationMemberRepository;
import com.movemate.chat.repository.ConversationRepository;
import com.movemate.chat.repository.MessageRepository;
import com.movemate.user.entity.AccountStatus;
import com.movemate.user.entity.Role;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ConversationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConversationRepository conversationRepository;

    @Autowired
    private ConversationMemberRepository conversationMemberRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private com.movemate.notification.repository.NotificationRepository notificationRepository;

    @Autowired
    private com.movemate.admin.repository.AuditLogRepository auditLogRepository;

    @Autowired
    private com.movemate.community.repository.ReportRepository reportRepository;

    @Autowired
    private ObjectMapper objectMapper;

    private User userA;
    private User userB;
    private User userC;
    private Conversation conversationAB;

    @BeforeEach
    void setUp() {
        auditLogRepository.deleteAll();
        reportRepository.deleteAll();
        notificationRepository.deleteAll();
        messageRepository.deleteAll();
        conversationMemberRepository.deleteAll();
        conversationRepository.deleteAll();
        userRepository.deleteAll();

        userA = userRepository.save(new User("userA@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE));
        userB = userRepository.save(new User("userB@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE));
        userC = userRepository.save(new User("userC@example.com", "Password123!", Role.USER, AccountStatus.ACTIVE));

        conversationAB = conversationRepository.save(new Conversation(ConversationType.DIRECT));
        conversationMemberRepository.save(new ConversationMember(conversationAB, userA));
        conversationMemberRepository.save(new ConversationMember(conversationAB, userB));

        messageRepository.save(new Message(conversationAB, userA, "Hello User B!", MessageType.TEXT));
    }

    @Test
    @WithMockUser(username = "userA@example.com")
    void getUserConversations_Success() throws Exception {
        mockMvc.perform(get("/api/v1/conversations"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].id").value(conversationAB.getId()));
    }

    @Test
    @WithMockUser(username = "userA@example.com")
    void createConversation_Success() throws Exception {
        CreateConversationRequest request = new CreateConversationRequest(userB.getId());

        mockMvc.perform(post("/api/v1/conversations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value(conversationAB.getId()));
    }

    @Test
    @WithMockUser(username = "userA@example.com")
    void sendMessage_Success() throws Exception {
        SendMessageRequest request = new SendMessageRequest("How are you doing?");

        mockMvc.perform(post("/api/v1/conversations/" + conversationAB.getId() + "/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.message").value("How are you doing?"));
    }

    @Test
    @WithMockUser(username = "userC@example.com")
    void getConversationMessages_Forbidden_WhenNotParticipant() throws Exception {
        mockMvc.perform(get("/api/v1/conversations/" + conversationAB.getId() + "/messages"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "userC@example.com")
    void sendMessage_Forbidden_WhenNotParticipant() throws Exception {
        SendMessageRequest request = new SendMessageRequest("Unauthorized intrusion attempt");

        mockMvc.perform(post("/api/v1/conversations/" + conversationAB.getId() + "/messages")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }
}
