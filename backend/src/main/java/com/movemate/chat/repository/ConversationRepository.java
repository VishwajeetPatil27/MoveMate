package com.movemate.chat.repository;

import com.movemate.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, Long> {

    @Query("SELECT cm.conversation FROM ConversationMember cm WHERE cm.user.id = :userId ORDER BY cm.conversation.updatedAt DESC")
    List<Conversation> findConversationsByUserId(@Param("userId") Long userId);

    @Query("SELECT cm1.conversation FROM ConversationMember cm1 JOIN ConversationMember cm2 ON cm1.conversation.id = cm2.conversation.id " +
           "WHERE cm1.user.id = :user1Id AND cm2.user.id = :user2Id AND cm1.conversation.type = 'DIRECT'")
    Optional<Conversation> findDirectConversationBetweenUsers(@Param("user1Id") Long user1Id, @Param("user2Id") Long user2Id);
}
