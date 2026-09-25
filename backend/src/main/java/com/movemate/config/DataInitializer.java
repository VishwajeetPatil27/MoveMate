package com.movemate.config;

import com.movemate.chat.entity.*;
import com.movemate.chat.repository.*;
import com.movemate.community.entity.*;
import com.movemate.community.repository.*;
import com.movemate.event.entity.*;
import com.movemate.event.repository.*;
import com.movemate.housing.entity.*;
import com.movemate.housing.repository.*;
import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.notification.entity.Notification;
import com.movemate.notification.entity.NotificationType;
import com.movemate.notification.repository.NotificationRepository;
import com.movemate.relocation.entity.RelocationPurpose;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.services.entity.Recommendation;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.*;
import com.movemate.user.repository.*;

import org.springframework.boot.CommandLineRunner;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
@org.springframework.context.annotation.Profile("!test")
public class DataInitializer implements CommandLineRunner {

    private final LocationRepository locationRepository;
    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final RelocationRequestRepository relocationRequestRepository;
    private final CommunityRepository communityRepository;
    private final CommunityMemberRepository communityMemberRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final LikeRepository likeRepository;
    private final AccommodationRepository accommodationRepository;
    private final RecommendationRepository recommendationRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final NotificationRepository notificationRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;
    private final MessageRepository messageRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            LocationRepository locationRepository,
            UserRepository userRepository,
            ProfileRepository profileRepository,
            RelocationRequestRepository relocationRequestRepository,
            CommunityRepository communityRepository,
            CommunityMemberRepository communityMemberRepository,
            PostRepository postRepository,
            CommentRepository commentRepository,
            LikeRepository likeRepository,
            AccommodationRepository accommodationRepository,
            RecommendationRepository recommendationRepository,
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            NotificationRepository notificationRepository,
            ConversationRepository conversationRepository,
            ConversationMemberRepository conversationMemberRepository,
            MessageRepository messageRepository,
            PasswordEncoder passwordEncoder) {
        this.locationRepository = locationRepository;
        this.userRepository = userRepository;
        this.profileRepository = profileRepository;
        this.relocationRequestRepository = relocationRequestRepository;
        this.communityRepository = communityRepository;
        this.communityMemberRepository = communityMemberRepository;
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.likeRepository = likeRepository;
        this.accommodationRepository = accommodationRepository;
        this.recommendationRepository = recommendationRepository;
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.notificationRepository = notificationRepository;
        this.conversationRepository = conversationRepository;
        this.conversationMemberRepository = conversationMemberRepository;
        this.messageRepository = messageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        seedLocations();
        seedUsersAndProfiles();
        seedRelocationRequests();
        seedCommunitiesAndMemberships();
        seedPostsAndComments();
        seedAccommodations();
        seedServices();
        seedEvents();
        seedNotifications();
        seedConversationsAndMessages();
    }

    private void seedLocations() {
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Hinjawadi", new BigDecimal("18.591200"), new BigDecimal("73.738900"));
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Wakad", new BigDecimal("18.598700"), new BigDecimal("73.768600"));
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Baner", new BigDecimal("18.559000"), new BigDecimal("73.786800"));
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Kharadi", new BigDecimal("18.551500"), new BigDecimal("73.946800"));
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Kothrud", new BigDecimal("18.507400"), new BigDecimal("73.807700"));
        createLocationIfAbsent("India", "Maharashtra", "Pune", "Viman Nagar", new BigDecimal("18.567900"), new BigDecimal("73.914300"));
        createLocationIfAbsent("India", "Maharashtra", "Mumbai", "Andheri East", new BigDecimal("19.113600"), new BigDecimal("72.869700"));
        createLocationIfAbsent("India", "Maharashtra", "Mumbai", "Bandra West", new BigDecimal("19.059600"), new BigDecimal("72.829500"));
        createLocationIfAbsent("India", "Karnataka", "Bengaluru", "Koramangala", new BigDecimal("12.935200"), new BigDecimal("77.624500"));
        createLocationIfAbsent("India", "Karnataka", "Bengaluru", "Indiranagar", new BigDecimal("12.978400"), new BigDecimal("77.640800"));
        createLocationIfAbsent("India", "Telangana", "Hyderabad", "HITECH City", new BigDecimal("17.443500"), new BigDecimal("78.377200"));
        createLocationIfAbsent("India", "Tamil Nadu", "Chennai", "Velachery", new BigDecimal("12.981500"), new BigDecimal("80.218000"));
        createLocationIfAbsent("India", "Delhi", "Delhi", "Connaught Place", new BigDecimal("28.631500"), new BigDecimal("77.216700"));
        createLocationIfAbsent("India", "Uttar Pradesh", "Noida", "Sector 62", new BigDecimal("28.628000"), new BigDecimal("77.364900"));
        createLocationIfAbsent("India", "Haryana", "Gurugram", "Cyber City", new BigDecimal("28.495000"), new BigDecimal("77.089500"));
    }

    private Location createLocationIfAbsent(String country, String state, String city, String area, BigDecimal lat, BigDecimal lng) {
        if (area != null && !area.isEmpty()) {
            return locationRepository.findFirstByCityAndStateAndArea(city, state, area)
                    .orElseGet(() -> locationRepository.save(new Location(country, state, city, area, lat, lng)));
        }
        return locationRepository.findFirstByCityAndState(city, state)
                .orElseGet(() -> locationRepository.save(new Location(country, state, city, area, lat, lng)));
    }

    private void seedUsersAndProfiles() {
        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);
        Location mumbai = locationRepository.findFirstByCityAndState("Mumbai", "Maharashtra").orElse(null);
        Location blr = locationRepository.findFirstByCityAndState("Bengaluru", "Karnataka").orElse(null);

        // 1. Admin
        createUserIfAbsent("admin@movemate.com", "Password123!", Role.ADMIN, "MoveMate System Admin", "Platform Administrator and System Governance Officer.", pune, pune, "System Administration", "MoveMate Corporate", "IIT Bombay", "English, Hindi, Marathi", "Tech, Governance, Community");

        // 2. Regular Relocator User
        createUserIfAbsent("user@movemate.com", "Password123!", Role.USER, "John Doe (Relocator)", "Moving to Pune for a new software engineering job. Looking for accommodation and local community!", mumbai, pune, "Software Engineer", "Tech Mahindra", "COEP Pune", "English, Hindi, Marathi", "Coding, Cricket, Trekking");

        // 3. Fictional User Aarav
        createUserIfAbsent("aarav.patil@example.com", "Password123!", Role.USER, "Aarav Patil", "Software engineer relocated to Pune. Tech enthusiast & coffee lover.", pune, pune, "Senior Developer", "Infosys", "VIT Pune", "English, Marathi", "Java, Gaming, Photography");

        // 4. Fictional User Priya
        createUserIfAbsent("priya.sharma@example.com", "Password123!", Role.USER, "Priya Sharma", "Product designer moved to Bengaluru. Passionate about UI/UX & exploring local cafes.", blr, blr, "UI/UX Designer", "Swiggy", "NID Ahmedabad", "English, Hindi", "Figma, Design, Music");

        // 5. Fictional User Rahul
        createUserIfAbsent("rahul.deshmukh@example.com", "Password123!", Role.USER, "Rahul Deshmukh", "Fintech consultant in Mumbai. Avid trekker and foodie.", mumbai, mumbai, "Fintech Consultant", "HDFC Bank", "IIM Ahmedabad", "English, Marathi", "Finance, Fitness, Traveling");

        // 6. Service Provider User
        createUserIfAbsent("provider.services@example.com", "Password123!", Role.USER, "MoveMate Verified Services", "Verified local service provider offering laundry, tiffin, electrical, and moving assistance.", pune, pune, "Service Partner", "MoveMate Services Ltd", "Savitribai Phule Pune University", "English, Hindi, Marathi", "Relocation, Housekeeping, Logistics");
    }

    private User createUserIfAbsent(String email, String password, Role role, String fullName, String bio, Location currentLoc, Location destLoc, String profession, String company, String college, String languages, String interests) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User(email, passwordEncoder.encode(password), role, AccountStatus.ACTIVE);
            User saved = userRepository.save(user);

            com.movemate.user.entity.Profile profile = new com.movemate.user.entity.Profile(saved, fullName);
            profile.setBio(bio);
            profile.setCurrentLocation(currentLoc);
            profile.setNativeLocation(destLoc);
            profile.setProfession(profession);
            profile.setCompany(company);
            profile.setCollege(college);
            profile.setLanguages(languages);
            profile.setInterests(interests);
            profileRepository.save(profile);

            return saved;
        });
    }

    private void seedRelocationRequests() {
        User relocator = userRepository.findByEmail("user@movemate.com").orElse(null);
        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);
        Location mumbai = locationRepository.findFirstByCityAndState("Mumbai", "Maharashtra").orElse(null);

        if (relocator != null && pune != null && mumbai != null && relocationRequestRepository.findByUserId(relocator.getId()).isEmpty()) {
            RelocationRequest request = new RelocationRequest(
                    relocator,
                    mumbai,
                    pune,
                    RelocationPurpose.JOB,
                    LocalDate.now().plusDays(14)
            );
            request.setProfession("Software Engineer");
            request.setBudget(new BigDecimal("20000.00"));
            request.setRequirements("Seeking 1BHK or shared flat near Wakad/Hinjawadi");
            relocationRequestRepository.save(request);
        }
    }

    private void seedCommunitiesAndMemberships() {
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);
        Location blr = locationRepository.findFirstByCityAndState("Bengaluru", "Karnataka").orElse(null);
        Location mumbai = locationRepository.findFirstByCityAndState("Mumbai", "Maharashtra").orElse(null);

        createCommunityIfAbsent("Pune Newcomers & Relocators", "pune-newcomers", "Official community for newcomers moving to Pune for jobs, education, and business.", pune, pune, admin);
        createCommunityIfAbsent("Pune IT & Tech Professionals", "pune-it-professionals", "Networking hub for software engineers, developers, and tech leads in Hinjawadi & Kharadi.", pune, pune, aarav);
        createCommunityIfAbsent("Bengaluru Tech & Startup Hub", "bengaluru-tech-hub", "Community for developers, founders, and engineers in Koramangala & Indiranagar.", blr, blr, admin);
        createCommunityIfAbsent("Mumbai New Residents Network", "mumbai-new-residents", "Connecting professionals and students moving to Mumbai.", mumbai, mumbai, admin);
    }

    private Community createCommunityIfAbsent(String name, String slug, String description, Location origin, Location destination, User creator) {
        return communityRepository.findBySlug(slug).orElseGet(() -> {
            Community comm = new Community(name, slug, description, origin, destination, creator);
            Community saved = communityRepository.save(comm);

            if (creator != null) {
                CommunityMember member = new CommunityMember(saved, creator, CommunityMemberRole.LEADER);
                communityMemberRepository.save(member);
            }
            return saved;
        });
    }

    private void seedPostsAndComments() {
        Community puneNewcomers = communityRepository.findBySlug("pune-newcomers").orElse(null);
        User relocator = userRepository.findByEmail("user@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);

        if (puneNewcomers != null && relocator != null && aarav != null && postRepository.findActivePostsByCommunity(puneNewcomers.getId(), PageRequest.of(0, 10)).isEmpty()) {
            Post post1 = new Post(relocator, puneNewcomers, "Looking for a shared 2BHK flat near Hinjawadi Phase 1 or Wakad", "Hi everyone! I am moving to Pune next week for a new tech role. My budget is around ₹15,000/month. Please suggest good areas or reach out if looking for a flatmate!", PostType.ACCOMMODATION);
            Post savedPost1 = postRepository.save(post1);

            Comment comment1 = new Comment(savedPost1, aarav, "Welcome to Pune! Check Wakad and Baner. They are around 15 mins commute to Hinjawadi and have great residential PGs.");
            commentRepository.save(comment1);

            Like like1 = new Like(savedPost1, aarav);
            likeRepository.save(like1);

            Post post2 = new Post(aarav, puneNewcomers, "Top 5 recommended areas for students and young professionals in Pune", "1. Baner (Great food & cafes)\n2. Wakad (Close to Hinjawadi IT Park)\n3. Kothrud (Peaceful & student friendly)\n4. Kharadi (EON IT Park proximity)\n5. Viman Nagar (Airport & mall access)", PostType.GENERAL);
            postRepository.save(post2);
        }
    }

    private void seedAccommodations() {
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        Location hinjawadi = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);

        if (aarav != null && hinjawadi != null && accommodationRepository.findAll().isEmpty()) {
            Accommodation acc1 = new Accommodation(
                    aarav,
                    "Modern 1BHK Furnished Apartment in Hinjawadi",
                    "Spacious, fully-furnished 1BHK with high-speed WiFi, power backup, and gated security. 5 mins commute to Hinjawadi IT Park.",
                    AccommodationType.FLAT,
                    new BigDecimal("18500.00"),
                    new BigDecimal("35000.00"),
                    hinjawadi
            );
            acc1.setFacilities("WiFi, Power Backup, Gym, Gated Security, Parking");
            acc1.setFurnished(FurnishingStatus.FULLY_FURNISHED);
            acc1.setAvailableFrom(LocalDate.now().plusDays(5));
            accommodationRepository.save(acc1);

            Accommodation acc2 = new Accommodation(
                    aarav,
                    "Luxury Co-Living PG Room in Wakad",
                    "Twin-sharing & single occupancy rooms for IT professionals. Includes daily housekeeping, laundry, and meals.",
                    AccommodationType.PG,
                    new BigDecimal("9500.00"),
                    new BigDecimal("15000.00"),
                    hinjawadi
            );
            acc2.setFacilities("Meals Included, WiFi, Housekeeping, Washing Machine");
            acc2.setFurnished(FurnishingStatus.SEMI_FURNISHED);
            acc2.setAvailableFrom(LocalDate.now().plusDays(2));
            accommodationRepository.save(acc2);
        }
    }

    private void seedServices() {
        User provider = userRepository.findByEmail("provider.services@example.com").orElse(null);
        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);

        if (provider != null && pune != null && recommendationRepository.findAll().isEmpty()) {
            Recommendation service1 = new Recommendation(
                    provider,
                    pune,
                    "Express Packers & Movers Pune",
                    ServiceCategory.ESSENTIAL_SERVICES
            );
            service1.setDescription("Professional house relocation, packing, loading, and safe inter-city transport across Pune and Mumbai.");
            service1.setAddress("Hinjawadi Main Road, Pune");
            service1.setPhone("+91 91234 56789");
            service1.setWebsite("https://expresspackers.example.com");
            service1.setSubcategory("Packers & Movers");
            recommendationRepository.save(service1);

            Recommendation service2 = new Recommendation(
                    provider,
                    pune,
                    "FreshBites Daily Tiffin & Meal Delivery",
                    ServiceCategory.FOOD
            );
            service2.setDescription("Hygienic, home-cooked North & South Indian meals delivered straight to your flat or PG.");
            service2.setAddress("Wakad Chowk, Pune");
            service2.setPhone("+91 91234 56790");
            service2.setWebsite("https://freshbites.example.com");
            service2.setSubcategory("Tiffin Services");
            recommendationRepository.save(service2);
        }
    }

    private void seedEvents() {
        Community puneNewcomers = communityRepository.findBySlug("pune-newcomers").orElse(null);
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);

        if (puneNewcomers != null && admin != null && eventRepository.findAll().isEmpty()) {
            Event event1 = new Event(
                    puneNewcomers,
                    admin,
                    "Pune Weekend Newcomers Coffee Meetup",
                    "Third Wave Coffee, High Street Baner, Pune",
                    LocalDateTime.now().plusDays(7).withHour(16).withMinute(0)
            );
            event1.setDescription("Friendly informal coffee meetup for everyone who recently relocated to Pune. Meet fellow software developers, students, and professionals!");
            Event savedEvent = eventRepository.save(event1);

            EventMember rsvp = new EventMember(savedEvent, admin, RsvpStatus.ATTENDING);
            eventMemberRepository.save(rsvp);
        }
    }

    private void seedNotifications() {
        User relocator = userRepository.findByEmail("user@movemate.com").orElse(null);
        if (relocator != null && notificationRepository.countByRecipientIdAndIsReadFalse(relocator.getId()) == 0) {
            Notification n1 = new Notification(
                    relocator,
                    NotificationType.SYSTEM,
                    "Welcome to MoveMate!",
                    "Your relocation account is active. Explore Pune communities, discover housing, and connect with locals.",
                    1L
            );
            notificationRepository.save(n1);

            Notification n2 = new Notification(
                    relocator,
                    NotificationType.EVENT_CREATED,
                    "Upcoming Event in Pune",
                    "Pune Weekend Newcomers Coffee Meetup is happening next weekend in Baner.",
                    1L
            );
            notificationRepository.save(n2);
        }
    }

    private void seedConversationsAndMessages() {
        User relocator = userRepository.findByEmail("user@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);

        if (relocator != null && aarav != null && conversationRepository.findAll().isEmpty()) {
            Conversation conv = new Conversation(ConversationType.DIRECT);
            Conversation savedConv = conversationRepository.save(conv);

            ConversationMember m1 = new ConversationMember(savedConv, relocator);
            ConversationMember m2 = new ConversationMember(savedConv, aarav);
            conversationMemberRepository.saveAll(List.of(m1, m2));

            Message msg1 = new Message(savedConv, relocator, "Hi Aarav! I saw your post in Pune Newcomers. Are Wakad PGs safe and well-connected?", MessageType.TEXT);
            messageRepository.save(msg1);

            Message msg2 = new Message(savedConv, aarav, "Hey John! Yes, Wakad is super safe and very popular for IT employees working in Hinjawadi.", MessageType.TEXT);
            messageRepository.save(msg2);
        }
    }
}
