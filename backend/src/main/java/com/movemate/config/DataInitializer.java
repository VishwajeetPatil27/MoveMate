package com.movemate.config;

import com.movemate.admin.entity.AuditLog;
import com.movemate.admin.repository.AuditLogRepository;
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
import com.movemate.services.entity.RecommendationFavorite;
import com.movemate.services.entity.ServiceCategory;
import com.movemate.services.repository.RecommendationFavoriteRepository;
import com.movemate.services.repository.RecommendationRepository;
import com.movemate.user.entity.*;
import com.movemate.user.repository.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
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

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

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
    private final AccommodationFavoriteRepository accommodationFavoriteRepository;
    private final RecommendationRepository recommendationRepository;
    private final RecommendationFavoriteRepository recommendationFavoriteRepository;
    private final EventRepository eventRepository;
    private final EventMemberRepository eventMemberRepository;
    private final NotificationRepository notificationRepository;
    private final ConversationRepository conversationRepository;
    private final ConversationMemberRepository conversationMemberRepository;
    private final MessageRepository messageRepository;
    private final ReportRepository reportRepository;
    private final AuditLogRepository auditLogRepository;
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
            AccommodationFavoriteRepository accommodationFavoriteRepository,
            RecommendationRepository recommendationRepository,
            RecommendationFavoriteRepository recommendationFavoriteRepository,
            EventRepository eventRepository,
            EventMemberRepository eventMemberRepository,
            NotificationRepository notificationRepository,
            ConversationRepository conversationRepository,
            ConversationMemberRepository conversationMemberRepository,
            MessageRepository messageRepository,
            ReportRepository reportRepository,
            AuditLogRepository auditLogRepository,
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
        this.accommodationFavoriteRepository = accommodationFavoriteRepository;
        this.recommendationRepository = recommendationRepository;
        this.recommendationFavoriteRepository = recommendationFavoriteRepository;
        this.eventRepository = eventRepository;
        this.eventMemberRepository = eventMemberRepository;
        this.notificationRepository = notificationRepository;
        this.conversationRepository = conversationRepository;
        this.conversationMemberRepository = conversationMemberRepository;
        this.messageRepository = messageRepository;
        this.reportRepository = reportRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        log.info("Starting MoveMate comprehensive demo data seeding...");
        seedLocations();
        seedUsersAndProfiles();
        seedRelocationRequests();
        seedCommunitiesAndMemberships();
        seedPostsAndInteractions();
        seedAccommodations();
        seedServices();
        seedEvents();
        seedConversationsAndMessages();
        seedNotifications();
        seedModerationReportsAndAuditLogs();
        log.info("MoveMate demo data seeding successfully completed.");
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
        createLocationIfAbsent("India", "Maharashtra", "Nashik", "College Road", new BigDecimal("19.997500"), new BigDecimal("73.789800"));
        createLocationIfAbsent("India", "West Bengal", "Kolkata", "Salt Lake", new BigDecimal("22.586700"), new BigDecimal("88.417800"));
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
        Location puneHinj = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Hinjawadi").orElse(null);
        Location puneBaner = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Baner").orElse(null);
        Location mumbaiBandra = locationRepository.findFirstByCityAndStateAndArea("Mumbai", "Maharashtra", "Bandra West").orElse(null);
        Location blrKora = locationRepository.findFirstByCityAndStateAndArea("Bengaluru", "Karnataka", "Koramangala").orElse(null);
        Location hyd = locationRepository.findFirstByCityAndStateAndArea("Hyderabad", "Telangana", "HITECH City").orElse(null);
        Location chennai = locationRepository.findFirstByCityAndStateAndArea("Chennai", "Tamil Nadu", "Velachery").orElse(null);
        Location delhi = locationRepository.findFirstByCityAndStateAndArea("Delhi", "Delhi", "Connaught Place").orElse(null);
        Location nashik = locationRepository.findFirstByCityAndStateAndArea("Nashik", "Maharashtra", "College Road").orElse(null);

        // 1. System Admin
        createUserIfAbsent("admin@movemate.com", "Password123!", Role.ADMIN, "Vikram Malhotra", "MoveMate System Administrator and Platform Governance Lead.", puneHinj, puneHinj, "Platform Admin", "MoveMate Technologies", "IIT Bombay", "English, Hindi, Marathi", "Tech, Security, Community");

        // 2. Regular Relocator User
        createUserIfAbsent("user@movemate.com", "Password123!", Role.USER, "Rohan Sharma", "Software engineer relocating from Mumbai to Pune for a new role. Looking for a flatmate and local weekend groups!", mumbaiBandra, puneHinj, "Software Engineer", "Tech Mahindra", "COEP Pune", "English, Hindi, Marathi", "Coding, Trekking, Badminton");

        // 3. Tech Lead (Pune)
        createUserIfAbsent("aarav.patil@example.com", "Password123!", Role.USER, "Aarav Patil", "Senior Tech Lead in Hinjawadi. 5 years in Pune. Coffee lover, weekend cyclist & amateur photographer.", puneHinj, puneHinj, "Tech Lead", "Infosys Technologies", "VIT Pune", "English, Marathi, Hindi", "Java, Cloud, Cycling, Photography");

        // 4. Product Designer (Bengaluru)
        createUserIfAbsent("priya.sharma@example.com", "Password123!", Role.USER, "Priya Sharma", "UI/UX Designer living in Koramangala. Relocated from Delhi. Passionate about design systems and cafe hopping.", blrKora, blrKora, "Product Designer", "Swiggy", "NID Ahmedabad", "English, Hindi", "Figma, Design, Coffee, Travel");

        // 5. Fintech Consultant (Mumbai)
        createUserIfAbsent("rahul.deshmukh@example.com", "Password123!", Role.USER, "Rahul Deshmukh", "Fintech Consultant based in Bandra. Passionate about equities, fitness, and weekend hiking.", mumbaiBandra, mumbaiBandra, "Fintech Consultant", "HDFC Bank", "IIM Ahmedabad", "English, Marathi, Hindi", "Finance, Fitness, Running");

        // 6. Service Provider User
        createUserIfAbsent("provider.services@example.com", "Password123!", Role.USER, "MoveMate Verified Partner", "Official verified partner coordinating housekeeping, tiffin delivery, packing, and relocation logistics.", puneBaner, puneBaner, "Operations Manager", "MoveMate Logistics Ltd", "Pune University", "English, Hindi, Marathi", "Relocation, Housekeeping, Moving");

        // 7. Student User (Pune)
        createUserIfAbsent("ananya.verma@example.com", "Password123!", Role.USER, "Ananya Verma", "Graduate student at Pune University. Passionate about book clubs, campus life, and sharing budget tips.", puneBaner, puneBaner, "Graduate Student", "Savitribai Phule Pune University", "Fergusson College", "English, Hindi", "Books, Campus Life, Music");

        // 8. Healthcare Professional (Hyderabad)
        createUserIfAbsent("dr.vikram.singh@example.com", "Password123!", Role.USER, "Dr. Vikram Singh", "Healthcare consultant in HITECH City. Enthusiast for health wellness and medical tech.", hyd, hyd, "Medical Officer", "Apollo Health City", "Osmania Medical College", "English, Telugu, Hindi", "Healthcare, Yoga, Nutrition");

        // 9. Digital Strategist (Delhi)
        createUserIfAbsent("neha.kapoor@example.com", "Password123!", Role.USER, "Neha Kapoor", "Digital growth manager living in central Delhi. Relocation mentor for North India newcomers.", delhi, delhi, "Growth Specialist", "Zomato", "Delhi University", "English, Hindi, Punjabi", "Marketing, Social Impact, Food");

        // 10. Cloud Architect (Chennai)
        createUserIfAbsent("karthik.rajan@example.com", "Password123!", Role.USER, "Karthik Rajan", "AWS Certified Solutions Architect based in Velachery. Passionate about open-source and Carnatic music.", chennai, chennai, "Cloud Architect", "Cognizant", "Anna University", "English, Tamil", "Cloud, Open Source, Music");

        // 11. Civil Engineer (Nashik)
        createUserIfAbsent("tanvi.kulkarni@example.com", "Password123!", Role.USER, "Tanvi Kulkarni", "Urban planner and architect in Nashik. Welcoming newcomers to wine capital of India.", nashik, nashik, "Urban Architect", "Kulkarni Associates", "KK Wagh Institute", "English, Marathi", "Architecture, Nature, Wine Tours");

        // 12. Community Coordinator (Mumbai)
        createUserIfAbsent("aditya.mehta@example.com", "Password123!", Role.USER, "Aditya Mehta", "Community coordinator hosting weekend walks, photo walks, and newcomer orientation in Mumbai.", mumbaiBandra, mumbaiBandra, "Event Producer", "Mehta Media Lab", "St. Xavier's College", "English, Gujarati, Hindi", "Events, Networking, Heritage");

        // 13. Data Scientist (Bengaluru)
        createUserIfAbsent("pooja.iyer@example.com", "Password123!", Role.USER, "Pooja Iyer", "Machine learning researcher in Indiranagar. Looking to connect with AI engineers and book readers.", blrKora, blrKora, "Data Scientist", "PhonePe", "IISc Bengaluru", "English, Tamil, Hindi", "Machine Learning, Reading, Hiking");

        // 14. Operations Lead (Pune)
        createUserIfAbsent("siddharth.joshi@example.com", "Password123!", Role.USER, "Siddharth Joshi", "Logistics and operations supervisor in Kharadi. Expert on local transport, metro lines, and tiffin hubs.", puneHinj, puneHinj, "Operations Lead", "Amazon Logistics", "Symbiosis Pune", "English, Marathi, Hindi", "Logistics, Board Games, Cricket");
    }

    private User createUserIfAbsent(String email, String password, Role role, String fullName, String bio, Location currentLoc, Location destLoc, String profession, String company, String college, String languages, String interests) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User(email, passwordEncoder.encode(password), role, AccountStatus.ACTIVE);
            User saved = userRepository.save(user);

            Profile profile = new Profile(saved, fullName);
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
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User karthik = userRepository.findByEmail("karthik.rajan@example.com").orElse(null);

        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);
        Location mumbai = locationRepository.findFirstByCityAndState("Mumbai", "Maharashtra").orElse(null);
        Location blr = locationRepository.findFirstByCityAndState("Bengaluru", "Karnataka").orElse(null);
        Location delhi = locationRepository.findFirstByCityAndState("Delhi", "Delhi").orElse(null);
        Location hyd = locationRepository.findFirstByCityAndState("Hyderabad", "Telangana").orElse(null);

        if (user != null && pune != null && mumbai != null && relocationRequestRepository.findByUserId(user.getId()).isEmpty()) {
            RelocationRequest req1 = new RelocationRequest(user, mumbai, pune, RelocationPurpose.JOB, LocalDate.now().plusDays(10));
            req1.setProfession("Software Engineer");
            req1.setBudget(new BigDecimal("22000.00"));
            req1.setRequirements("Looking for a 1BHK or twin-sharing flat in Wakad or Baner near Hinjawadi IT Park.");
            relocationRequestRepository.save(req1);
        }

        if (priya != null && blr != null && delhi != null && relocationRequestRepository.findByUserId(priya.getId()).isEmpty()) {
            RelocationRequest req2 = new RelocationRequest(priya, delhi, blr, RelocationPurpose.JOB, LocalDate.now().plusDays(25));
            req2.setProfession("Product Designer");
            req2.setBudget(new BigDecimal("28000.00"));
            req2.setRequirements("Gated society 1BHK/2BHK in Koramangala or Indiranagar with high-speed fiber.");
            relocationRequestRepository.save(req2);
        }

        if (karthik != null && hyd != null && pune != null && relocationRequestRepository.findByUserId(karthik.getId()).isEmpty()) {
            RelocationRequest req3 = new RelocationRequest(karthik, pune, hyd, RelocationPurpose.JOB, LocalDate.now().plusDays(40));
            req3.setProfession("Cloud Architect");
            req3.setBudget(new BigDecimal("25000.00"));
            req3.setRequirements("Apartment close to HITECH City Metro with covered parking.");
            relocationRequestRepository.save(req3);
        }
    }

    private void seedCommunitiesAndMemberships() {
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User rahul = userRepository.findByEmail("rahul.deshmukh@example.com").orElse(null);
        User ananya = userRepository.findByEmail("ananya.verma@example.com").orElse(null);
        User neha = userRepository.findByEmail("neha.kapoor@example.com").orElse(null);
        User karthik = userRepository.findByEmail("karthik.rajan@example.com").orElse(null);
        User tanvi = userRepository.findByEmail("tanvi.kulkarni@example.com").orElse(null);
        User aditya = userRepository.findByEmail("aditya.mehta@example.com").orElse(null);
        User drVikram = userRepository.findByEmail("dr.vikram.singh@example.com").orElse(null);
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);

        Location pune = locationRepository.findFirstByCityAndState("Pune", "Maharashtra").orElse(null);
        Location mumbai = locationRepository.findFirstByCityAndState("Mumbai", "Maharashtra").orElse(null);
        Location blr = locationRepository.findFirstByCityAndState("Bengaluru", "Karnataka").orElse(null);
        Location hyd = locationRepository.findFirstByCityAndState("Hyderabad", "Telangana").orElse(null);
        Location chennai = locationRepository.findFirstByCityAndState("Chennai", "Tamil Nadu").orElse(null);
        Location delhi = locationRepository.findFirstByCityAndState("Delhi", "Delhi").orElse(null);
        Location nashik = locationRepository.findFirstByCityAndState("Nashik", "Maharashtra").orElse(null);

        // 12 Communities
        Community c1 = createCommunityIfAbsent("Pune IT & Tech Professionals", "pune-it-professionals", "Networking hub for software engineers, tech leads, and tech relocators in Hinjawadi & Kharadi.", pune, pune, aarav);
        Community c2 = createCommunityIfAbsent("Pune Newcomers & Relocators", "pune-newcomers", "Official welcoming community for everyone relocating to Pune for employment, education, and fresh starts.", pune, pune, admin);
        Community c3 = createCommunityIfAbsent("Students & Scholars in Pune", "students-pune", "Dedicated community for college students, university scholars, exam preppers, and interns in Pune.", pune, pune, ananya);
        Community c4 = createCommunityIfAbsent("Mumbai New Residents Network", "mumbai-new-residents", "Connecting professionals, creatives, and relocators settling down in Mumbai suburbs and town.", mumbai, mumbai, rahul);
        Community c5 = createCommunityIfAbsent("Women Relocating to Mumbai", "women-relocating-mumbai", "Safe space, verified flatmate matching, safety guidance, and meetups for women moving to Mumbai.", mumbai, mumbai, neha);
        Community c6 = createCommunityIfAbsent("Bengaluru Tech & Startup Hub", "bengaluru-tech-hub", "Premier meetup and discussion forum for software developers, founders, and designers in Koramangala & Indiranagar.", blr, blr, priya);
        Community c7 = createCommunityIfAbsent("Freshers & Recent Graduates", "freshers-graduates", "Connecting campus recruits, junior developers, and first-time city movers sharing housing and budget tips.", blr, blr, ananya);
        Community c8 = createCommunityIfAbsent("Hyderabad Job Seekers & Techies", "hyderabad-job-seekers", "Career guidance, IT company referrals, and accommodation assistance around HITECH City & Gachibowli.", hyd, hyd, drVikram);
        Community c9 = createCommunityIfAbsent("Delhi NCR Newcomers Circle", "delhi-ncr-newcomers", "Guide to transit, metro routes, food spots, and rental accommodations across Delhi, Gurgaon, and Noida.", delhi, delhi, neha);
        Community c10 = createCommunityIfAbsent("Chennai Tech & Engineering Community", "chennai-tech-community", "Connecting tech professionals, IT relocators, and language exchange groups in Chennai OMR & Velachery.", chennai, chennai, karthik);
        Community c11 = createCommunityIfAbsent("Nashik Local Residents & Movers", "nashik-local-community", "Community for peace seekers, remote workers, and newcomers discovering the cultural & natural beauty of Nashik.", nashik, nashik, tanvi);
        Community c12 = createCommunityIfAbsent("Pune Flatmates & Shared Living Hub", "pune-flatmates-rooms", "Fast-moving flatmate listings, room vacancy postings, and no-brokerage house hunting in Pune.", pune, pune, user);

        // Enroll members in communities so counts are high & realistic
        enrollMemberIfAbsent(c1, aarav, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c1, user, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c1, admin, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c1, priya, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c2, admin, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c2, user, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c2, aarav, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c2, ananya, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c2, rahul, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c3, ananya, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c3, user, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c3, aarav, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c4, rahul, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c4, aditya, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c4, user, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c4, neha, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c5, neha, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c5, priya, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c5, ananya, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c6, priya, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c6, aarav, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c6, karthik, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c6, user, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c7, ananya, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c7, user, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c7, priya, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c8, drVikram, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c8, karthik, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c8, user, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c9, neha, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c9, priya, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c9, admin, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c10, karthik, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c10, aarav, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c10, user, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c11, tanvi, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c11, rahul, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c11, user, CommunityMemberRole.MEMBER);

        enrollMemberIfAbsent(c12, user, CommunityMemberRole.LEADER);
        enrollMemberIfAbsent(c12, aarav, CommunityMemberRole.MEMBER);
        enrollMemberIfAbsent(c12, ananya, CommunityMemberRole.MEMBER);
    }

    private Community createCommunityIfAbsent(String name, String slug, String description, Location origin, Location destination, User creator) {
        return communityRepository.findBySlug(slug).orElseGet(() -> {
            Community comm = new Community(name, slug, description, origin, destination, creator);
            return communityRepository.save(comm);
        });
    }

    private void enrollMemberIfAbsent(Community community, User user, CommunityMemberRole role) {
        if (community == null || user == null) return;
        if (communityMemberRepository.findByCommunityIdAndUserId(community.getId(), user.getId()).isEmpty()) {
            CommunityMember member = new CommunityMember(community, user, role);
            communityMemberRepository.save(member);
        }
    }

    private void seedPostsAndInteractions() {
        Community puneIt = communityRepository.findBySlug("pune-it-professionals").orElse(null);
        Community puneNew = communityRepository.findBySlug("pune-newcomers").orElse(null);
        Community students = communityRepository.findBySlug("students-pune").orElse(null);
        Community mumbaiNew = communityRepository.findBySlug("mumbai-new-residents").orElse(null);
        Community blrTech = communityRepository.findBySlug("bengaluru-tech-hub").orElse(null);
        Community freshers = communityRepository.findBySlug("freshers-graduates").orElse(null);
        Community hyderabad = communityRepository.findBySlug("hyderabad-job-seekers").orElse(null);
        Community delhiNew = communityRepository.findBySlug("delhi-ncr-newcomers").orElse(null);
        Community chennaiTech = communityRepository.findBySlug("chennai-tech-community").orElse(null);
        Community nashikComm = communityRepository.findBySlug("nashik-local-community").orElse(null);
        Community flatmates = communityRepository.findBySlug("pune-flatmates-rooms").orElse(null);

        User user = userRepository.findByEmail("user@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User rahul = userRepository.findByEmail("rahul.deshmukh@example.com").orElse(null);
        User ananya = userRepository.findByEmail("ananya.verma@example.com").orElse(null);
        User neha = userRepository.findByEmail("neha.kapoor@example.com").orElse(null);
        User karthik = userRepository.findByEmail("karthik.rajan@example.com").orElse(null);
        User tanvi = userRepository.findByEmail("tanvi.kulkarni@example.com").orElse(null);
        User drVikram = userRepository.findByEmail("dr.vikram.singh@example.com").orElse(null);
        User aditya = userRepository.findByEmail("aditya.mehta@example.com").orElse(null);
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);

        // 32 Realistic Posts
        createPostWithInteractions(puneNew, user, "Moving to Pune next Monday — Looking for flatmate or 1BHK in Wakad", "Hi everyone! Relocating from Mumbai for an IT role in Hinjawadi Phase 1. Budget is ₹12k-16k. Any leads on good societies near Wakad Chowk or Datta Mandir road?", PostType.ACCOMMODATION,
                List.of(new CommentData(aarav, "Welcome Rohan! Look at societies like Costa Blanca, Kolte Patil Western Avenue, or Pride Purple Park Royale. Very good connectivity."),
                        new CommentData(ananya, "Also check Wakad-Hinjawadi link road. Plenty of high-speed shuttle buses run every 10 mins.")),
                List.of(aarav, ananya, admin));

        createPostWithInteractions(puneIt, aarav, "Guide: Commute options to Hinjawadi IT Park Phase 1, 2, and 3", "Commuting to Hinjawadi can be tricky during peak hours (8:30-10:30 AM). Here are top tips: 1. Metro line 3 work is ongoing, use Wakad flyover route early. 2. Metro feeder shuttle buses run from Baner and Balewadi. 3. Carpooling apps are heavily active.", PostType.LOCAL_INFO,
                List.of(new CommentData(user, "Super helpful guide! What is the usual evening peak hour traffic?"),
                        new CommentData(aarav, "Evenings 6:30 PM to 8:30 PM are peak. Leaving post 8 PM is smooth.")),
                List.of(user, priya, rahul, karthik));

        createPostWithInteractions(puneNew, aarav, "Top 5 recommended food & cafe streets for newcomers in Pune", "If you just arrived in Pune, do not miss: 1. Baner Balewadi High Street (Craft coffee & casual dining) 2. FC Road (Iconic student food, Vaishali & Goodluck Cafe) 3. Viman Nagar (Cozy bakeries & chill cafes) 4. Kothrud (Authentic Maharashtrian misal) 5. Salunke Vihar (Shawarmas & evening snacks)", PostType.GENERAL,
                List.of(new CommentData(ananya, "Vaishali filter coffee and Cafe Goodluck bun maska are must-haves!"),
                        new CommentData(user, "Bookmarking this! Baner High Street is very close to where I'm staying.")),
                List.of(user, ananya, rahul));

        createPostWithInteractions(puneIt, user, "Tech salaries & living expense breakdown for 2-5 YOE in Pune", "Planning monthly expenses for Hinjawadi relocators: Rent (shared 2BHK): ~₹12,000 | Cook & Maid: ~₹3,500 | Groceries/Dining: ~₹8,000 | Utilities/WiFi: ~₹1,500 | Transport: ~₹3,000. Total living cost is roughly ₹28,000/month. What are your numbers?", PostType.GENERAL,
                List.of(new CommentData(aarav, "That's very accurate. Single occupancy flat increases rent to ~₹18k-22k."),
                        new CommentData(rahul, "Compared to Mumbai, you save almost 35% on rent and commute.")),
                List.of(aarav, rahul, priya));

        createPostWithInteractions(students, ananya, "Best affordable study cafes and libraries with fast Wi-Fi in Pune", "For everyone preparing for exams, GATE, or coding interviews: 1. British Council Library (Shivajinagar) 2. Pagdandi Bookstore Cafe (Baner) 3. Waari Book Cafe (Kothrud) 4. Pune Central Library. Most have quiet zones and power outlets!", PostType.LOCAL_INFO,
                List.of(new CommentData(user, "Pagdandi Baner is awesome. Very peaceful vibe.")),
                List.of(user, aarav));

        createPostWithInteractions(flatmates, user, "Urgent: 1 Room available in 3BHK high-rise society in Baner (₹11,500/mo)", "One semi-furnished master bedroom with attached bathroom available in Baner. Includes high-speed 300 Mbps fiber, RO purifier, microwave, washing machine. Available immediately. No brokerage.", PostType.ACCOMMODATION,
                List.of(new CommentData(aarav, "Sent you a DM on MoveMate chat with a friend's contact!")),
                List.of(aarav, admin));

        createPostWithInteractions(mumbaiNew, rahul, "First month in Mumbai: Surviving the local trains and monsoon commute", "Key rules for newcomers: 1. Download Yatri app or M-Indicator for train timings. 2. AC locals are worth the season pass for peak hours. 3. Always carry a waterproof bag liner. 4. Western line connects Bandra to Churchgate in 30 mins.", PostType.LOCAL_INFO,
                List.of(new CommentData(aditya, "And always stay on the left side of escalators at Dadar station!"),
                        new CommentData(neha, "AC local train pass saved my daily commute to Lower Parel.")),
                List.of(aditya, neha, user));

        createPostWithInteractions(mumbaiNew, aditya, "Weekend Photo-walk & street food crawl: Bandra Bandstand to Carter Road", "Join fellow Mumbai newcomers this Saturday 5 PM! We'll start at Mount Mary, walk through Ranwar village, and end with sunset snacks at Carter Road. Free meetup!", PostType.EVENT,
                List.of(new CommentData(rahul, "Count me in! Bringing two friends from my society.")),
                List.of(rahul, user, neha));

        createPostWithInteractions(blrTech, priya, "Top co-working spaces for remote devs in Koramangala & Indiranagar", "Curated list of spaces with reliable backup & community: 1. WeWork Galaxy on Residency Rd 2. 91springboard Indiranagar 3. BHIVE HSR 4. Dialogues Cafe Koramangala. Great places to meet founders!", PostType.GENERAL,
                List.of(new CommentData(karthik, "Dialogues cafe has a pay-per-minute model which is great for quick sprint work.")),
                List.of(karthik, user));

        createPostWithInteractions(blrTech, karthik, "Moving from Chennai to Bengaluru: Rent deposit realities & negotiation", "Be prepared: Bangalore landlords often ask for 5 to 6 months deposit upfront. However, startup-heavy areas like HSR and Bellandur are now accepting 2-3 months on platforms like MoveMate.", PostType.ACCOMMODATION,
                List.of(new CommentData(priya, "Always get painting and maintenance charges explicitly written in agreement.")),
                List.of(priya, user, aarav));

        createPostWithInteractions(freshers, ananya, "First job relocation checklist: Documents you will need on Day 1", "Keep physical and digital copies ready: 1. Degree certificates & marksheets 2. Pan Card & Aadhaar with updated address 3. Passport copy for background verification 4. Relieving letter / internship letter 5. Bank cancelled cheque for payroll setup.", PostType.CAREER,
                List.of(new CommentData(user, "Very helpful checklist for recent grads.")),
                List.of(user, priya));

        createPostWithInteractions(hyderabad, drVikram, "Best residential localities near HITECH City & Financial District", "For doctors, techies, and consultants moving to Hyderabad: 1. Kondapur (Great residential pockets & food) 2. Madhapur (Near night markets & metro) 3. Gachibowli (Spacious gated townships) 4. Manikonda (Budget friendly)", PostType.LOCAL_INFO,
                List.of(new CommentData(karthik, "Kondapur has great hospital proximity too.")),
                List.of(karthik, user));

        createPostWithInteractions(delhiNew, neha, "Delhi Metro navigation hacks: Yellow Line vs Violet Line connectivity", "Delhi Metro is the lifeline of NCR. Yellow line connects Gurugram Cyber City to New Delhi railway station seamlessly. Airport Express line takes 18 mins to T3. Get a smart card on day 1!", PostType.LOCAL_INFO,
                List.of(new CommentData(admin, "Metro card also gives 10-20% fare discount during non-peak hours.")),
                List.of(admin, user));

        createPostWithInteractions(chennaiTech, karthik, "Living in OMR vs Velachery for tech employees: Pros & Cons", "Velachery: Closer to airport, phoenix mall, local trains. OMR: Closer to TCS, Cognizant, Infosys SEZ campus, less traffic within IT corridor. I recommend Velachery for families and OMR for bachelors.", PostType.GENERAL,
                List.of(new CommentData(aarav, "OMR road toll was recently abolished in certain stretches too.")),
                List.of(aarav, user));

        createPostWithInteractions(nashikComm, tanvi, "Remote workers moving to Nashik: High-speed internet & lifestyle review", "Nashik is becoming a favorite for remote developers looking for cleaner air, affordable spacious 2BHKs (₹10k/mo), and quick 3-hour road access to Mumbai and Pune. Fiber broadband is available everywhere.", PostType.GENERAL,
                List.of(new CommentData(user, "Sounds like a wonderful weekend retreat as well.")),
                List.of(user, rahul));

        createPostWithInteractions(puneIt, aarav, "Quarterly Tech Meetup: Microservices & AI Engineering in Pune", "Hey engineers! We are organizing a community roundtable on Spring Boot 3, Vector Databases, and Kubernetes deployment on Saturday afternoon. Venue: Baner High Street.", PostType.EVENT,
                List.of(new CommentData(user, "Already registered! Looking forward to meeting everyone in person.")),
                List.of(user, karthik, priya));

        createPostWithInteractions(puneNew, ananya, "Trusted home tiffin and dabba services in Wakad, Baner & Pimple Saudagar", "Finding good food when you just moved in can be stressful. We collected contact details of 4 verified home-kitchen tiffin providers delivering healthy veg/non-veg meals at ₹70-90 per plate.", PostType.LOCAL_INFO,
                List.of(new CommentData(user, "Could you share the WhatsApp number for the Wakad provider?"),
                        new CommentData(ananya, "Check the Local Services tab on MoveMate, they are listed under FreshBites!")),
                List.of(user, aarav));

        createPostWithInteractions(mumbaiNew, rahul, "Gym and sports clubs with monthly membership in Mumbai Western Suburbs", "Looking for fitness spots: Cult.fit has great center density in Andheri & Bandra. For badminton, check Kick on Goregaon link road or Wings Sports Center in Bandra.", PostType.GENERAL,
                List.of(new CommentData(aditya, "Wings center also has floodlit football turf on weekends.")),
                List.of(aditya, user));

        createPostWithInteractions(blrTech, priya, "Weekend getaway trips around Bengaluru: Nandi Hills, Coorg, and Kabini", "If you just moved to Bangalore, take advantage of the highway connections! Nandi hills is 1.5 hrs early morning. Mysore expressway gets you to Mysore in under 90 minutes.", PostType.GENERAL,
                List.of(new CommentData(karthik, "Early morning drive on Mysore highway is delightful.")),
                List.of(karthik, user));

        createPostWithInteractions(flatmates, aarav, "Furnished 2BHK flat share near Hinjawadi Phase 2 Wipro Circle", "Looking for 1 flatmate for a furnished 2BHK in Megapolis Mystic. Air conditioner, geyser, modular kitchen, balcony with green view. Rent ₹10,000/person.", PostType.ACCOMMODATION,
                List.of(new CommentData(user, "Sent you an inquiry message!")),
                List.of(user, admin));

        createPostWithInteractions(students, ananya, "Second-hand furniture & study tables marketplace in Pune", "Graduating seniors in Kothrud and Deccan often sell study desks, revolving chairs, and bookshelves at 70% off. Keep an eye on MoveMate community notices this weekend.", PostType.GENERAL,
                List.of(new CommentData(user, "Need a study chair, will definitely check it out.")),
                List.of(user, aarav));

        createPostWithInteractions(delhiNew, neha, "Safest residential areas in South Delhi & Noida for single relocators", "Societies with 24x7 gated security, intercom, and active RWA: 1. Sector 62 & 137 in Noida 2. CR Park & GK in South Delhi 3. Cyber City Phase 2 & 3 in Gurgaon.", PostType.ACCOMMODATION,
                List.of(new CommentData(admin, "Verified security guidelines are available in our newcomer safety brief.")),
                List.of(admin, user));

        createPostWithInteractions(hyderabad, drVikram, "24x7 Pharmacies and urgent healthcare clinics in HITECH City", "Save these emergency contacts: Apollo Clinic Kondapur (24 hrs), Yashoda Hospitals HITECH, MedPlus Gachibowli. All offer home delivery within 30 mins.", PostType.LOCAL_INFO,
                List.of(new CommentData(user, "Crucial info for anyone new to the city. Thank you doctor!")),
                List.of(user, karthik));

        createPostWithInteractions(chennaiTech, karthik, "Weekend filter coffee and breakfast trails in Mylapore & Besant Nagar", "Start your Sunday at Rayar's Mess or Mami Tiffin Stall in Mylapore, followed by a breezy morning walk on Elliot's Beach Besant Nagar.", PostType.GENERAL,
                List.of(new CommentData(priya, "Besant Nagar beach is one of the cleanest coastal stretches in the country.")),
                List.of(priya, user));

        createPostWithInteractions(puneNew, user, "Electricity & Gas connection transfer guide for Pune rental flats", "Tips from my recent move: 1. MSEDCL electricity bills can be paid online via Mahavitaran app. 2. For gas cylinders, Bharat Gas and Indane online portals transfer connections within 48 hours without visiting distributor.", PostType.LOCAL_INFO,
                List.of(new CommentData(aarav, "Great tip! Most societies also have piped MNGL gas connections now.")),
                List.of(aarav, admin));

        createPostWithInteractions(puneIt, aarav, "Pune Open Source & Cloud Meetup: Docker, Spring Boot & AI Stack", "Monthly casual meetup for developers at Baner High Street. Bring your laptop, showcase side projects, and connect with fellow tech relocators!", PostType.EVENT,
                List.of(new CommentData(user, "See you there Aarav!")),
                List.of(user, karthik));

        createPostWithInteractions(freshers, user, "How to handle company onboarding while relocating across states", "Key advice: Complete your PF transfer and HRA rent receipts early. Always keep your landlord's PAN card handy if rent is above ₹8,333/month.", PostType.CAREER,
                List.of(new CommentData(ananya, "Super practical advice for first time tax payers!")),
                List.of(ananya, aarav));

        createPostWithInteractions(mumbaiNew, aditya, "Mumbai Heritage Art Walk: Kala Ghoda & Fort district", "Exploring Mumbai's Victorian gothic architecture, David Sassoon library, and Jehangir Art Gallery this Sunday. Open for all newcomers!", PostType.EVENT,
                List.of(new CommentData(rahul, "Joining! Kala Ghoda is stunning this time of year.")),
                List.of(rahul, neha));

        createPostWithInteractions(nashikComm, tanvi, "Monsoon trekking spots near Nashik: Brahmagiri, Anjaneri & Harihar", "The Sahyadris are lush green. Perfect weekend day-hikes for anyone relocating to Maharashtra. Make sure to wear sturdy trekking shoes.", PostType.GENERAL,
                List.of(new CommentData(aarav, "Harihar rock steps are thrilling! Highly recommended.")),
                List.of(aarav, user));

        createPostWithInteractions(flatmates, user, "Pre-screened roommate agreement template for shared apartments", "To avoid flatmate misunderstandings regarding utility bills, cleaning schedules, and guest policies, here is a simple agreement template we use.", PostType.GENERAL,
                List.of(new CommentData(aarav, "Every shared flat should follow this. Prevents all disputes.")),
                List.of(aarav, priya));

        createPostWithInteractions(puneNew, admin, "Community Safety & Verification Announcement: Zero Tolerance for Broker Spam", "Please report any unauthorized commercial broker posts in community feeds using the 'Report' button. MoveMate is 100% dedicated to genuine relocators!", PostType.GENERAL,
                List.of(new CommentData(user, "Thank you team for keeping this community clean and trustworthy.")),
                List.of(user, aarav, ananya, rahul));
    }

    private void createPostWithInteractions(Community community, User author, String title, String content, PostType type, List<CommentData> comments, List<User> likers) {
        if (community == null || author == null) return;
        Post post = postRepository.findFirstByTitle(title).orElseGet(() -> {
            Post p = new Post(author, community, title, content, type);
            return postRepository.save(p);
        });

        if (comments != null) {
            for (CommentData cd : comments) {
                if (cd.user != null) {
                    boolean exists = commentRepository.findByPostIdAndStatusNot(post.getId(), CommentStatus.DELETED).stream()
                            .anyMatch(c -> c.getAuthor().getId().equals(cd.user.getId()) && c.getContent().equals(cd.content));
                    if (!exists) {
                        Comment comment = new Comment(post, cd.user, cd.content);
                        commentRepository.save(comment);
                    }
                }
            }
        }

        if (likers != null) {
            for (User liker : likers) {
                if (liker != null && !likeRepository.existsByPostIdAndUserId(post.getId(), liker.getId())) {
                    Like like = new Like(post, liker);
                    likeRepository.save(like);
                }
            }
        }
    }

    private static class CommentData {
        User user;
        String content;
        CommentData(User user, String content) {
            this.user = user;
            this.content = content;
        }
    }

    private void seedAccommodations() {
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        User provider = userRepository.findByEmail("provider.services@example.com").orElse(null);
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User rahul = userRepository.findByEmail("rahul.deshmukh@example.com").orElse(null);

        Location puneHinj = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Hinjawadi").orElse(null);
        Location puneWakad = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Wakad").orElse(null);
        Location puneBaner = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Baner").orElse(null);
        Location puneKharadi = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Kharadi").orElse(null);
        Location puneKothrud = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Kothrud").orElse(null);
        Location puneViman = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Viman Nagar").orElse(null);
        Location mumbaiAndheri = locationRepository.findFirstByCityAndStateAndArea("Mumbai", "Maharashtra", "Andheri East").orElse(null);
        Location mumbaiBandra = locationRepository.findFirstByCityAndStateAndArea("Mumbai", "Maharashtra", "Bandra West").orElse(null);
        Location blrKora = locationRepository.findFirstByCityAndStateAndArea("Bengaluru", "Karnataka", "Koramangala").orElse(null);
        Location blrIndira = locationRepository.findFirstByCityAndStateAndArea("Bengaluru", "Karnataka", "Indiranagar").orElse(null);
        Location hyd = locationRepository.findFirstByCityAndStateAndArea("Hyderabad", "Telangana", "HITECH City").orElse(null);
        Location chennai = locationRepository.findFirstByCityAndStateAndArea("Chennai", "Tamil Nadu", "Velachery").orElse(null);
        Location delhi = locationRepository.findFirstByCityAndStateAndArea("Delhi", "Delhi", "Connaught Place").orElse(null);
        Location noida = locationRepository.findFirstByCityAndStateAndArea("Noida", "Uttar Pradesh", "Sector 62").orElse(null);
        Location gurugram = locationRepository.findFirstByCityAndStateAndArea("Gurugram", "Haryana", "Cyber City").orElse(null);
        Location nashik = locationRepository.findFirstByCityAndStateAndArea("Nashik", "Maharashtra", "College Road").orElse(null);

        // 22 Realistic Accommodation Listings
        Accommodation a1 = createAccommodationIfAbsent(aarav, "Modern 1BHK Furnished Apartment in Hinjawadi", "Spacious, fully-furnished 1BHK with high-speed WiFi, power backup, and gated security. 5 mins commute to Hinjawadi IT Park Phase 1.", AccommodationType.FLAT, new BigDecimal("18500.00"), new BigDecimal("35000.00"), puneHinj, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "WiFi, AC, Power Backup, Gym, Gated Security, Parking, Lift", LocalDate.now().plusDays(2));
        Accommodation a2 = createAccommodationIfAbsent(provider, "Luxury Co-Living PG Room in Wakad", "Twin-sharing & single occupancy rooms for IT professionals. Includes daily housekeeping, laundry, high speed fiber, and home cooked meals.", AccommodationType.PG, new BigDecimal("9500.00"), new BigDecimal("15000.00"), puneWakad, FurnishingStatus.FULLY_FURNISHED, GenderPreference.MALE, "Meals Included, WiFi, Housekeeping, Washing Machine, Geyser, RO Water", LocalDate.now().plusDays(3));
        Accommodation a3 = createAccommodationIfAbsent(aarav, "Premium 2BHK Society Flat on Baner High Street", "High-floor 2BHK with modular kitchen, private balcony, covered car parking, club house, and swimming pool. Walkable to cafes & supermarkets.", AccommodationType.FLAT, new BigDecimal("28000.00"), new BigDecimal("50000.00"), puneBaner, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Swimming Pool, Gym, Club House, 24x7 Security, Intercom, Reserved Parking", LocalDate.now().plusDays(7));
        Accommodation a4 = createAccommodationIfAbsent(provider, "Executive Women PG & Studio in Viman Nagar", "Safe, gated co-living residence for working women and students. Biometric entry, CCTV on every floor, 3 home-cooked meals, and high-speed WiFi.", AccommodationType.PG, new BigDecimal("11000.00"), new BigDecimal("18000.00"), puneViman, FurnishingStatus.FULLY_FURNISHED, GenderPreference.FEMALE, "Biometric Security, CCTV, WiFi, 3 Meals, Daily Housekeeping, Washing Machine", LocalDate.now().plusDays(1));
        Accommodation a5 = createAccommodationIfAbsent(aarav, "Single Private Room in 3BHK Kharadi EON IT Park", "Private master bedroom with attached bathroom and balcony in a premium high-rise 500m from EON Free Zone. Sharing hall and kitchen.", AccommodationType.ROOM, new BigDecimal("13500.00"), new BigDecimal("20000.00"), puneKharadi, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Attached Bath, Balcony, WiFi, Maid Service, Modular Kitchen, Refrigerator", LocalDate.now().plusDays(5));
        Accommodation a6 = createAccommodationIfAbsent(provider, "Budget Student Shared Room in Kothrud", "Twin-sharing room near MIT World Peace University and Fergusson College. Peaceful residential area with easy access to bus stops and mess.", AccommodationType.ROOM, new BigDecimal("7500.00"), new BigDecimal("12000.00"), puneKothrud, FurnishingStatus.SEMI_FURNISHED, GenderPreference.MALE, "Study Table, Wardrobe, WiFi, Water Purifier, Bike Parking", LocalDate.now().plusDays(4));
        Accommodation a7 = createAccommodationIfAbsent(rahul, "Sea-Breeze 1BHK Apartment in Bandra West", "Quaint, charming 1BHK apartment in quiet lane off Perry Cross Road. Walkable to Bandstand and Carter Road. Fully air-conditioned.", AccommodationType.FLAT, new BigDecimal("38000.00"), new BigDecimal("75000.00"), mumbaiBandra, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "AC in all rooms, WiFi, Water Supply, Piped Gas, Security, Near Seafront", LocalDate.now().plusDays(10));
        Accommodation a8 = createAccommodationIfAbsent(provider, "Studio Room near Andheri Metro & SEEPZ", "Self-contained studio room with private kitchen counter and bath. 5 mins walk to Western Express Highway Metro Station.", AccommodationType.ROOM, new BigDecimal("19000.00"), new BigDecimal("35000.00"), mumbaiAndheri, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Near Metro, Private Entrance, Lift, Security, Water Tank", LocalDate.now().plusDays(6));
        Accommodation a9 = createAccommodationIfAbsent(priya, "Sunny 1BHK Flat in Koramangala 4th Block", "Spacious 1BHK flat in prime tech hub. Walkable to Dialogues cafe, Sony Signal, and restaurants. Ideal for software devs and designers.", AccommodationType.FLAT, new BigDecimal("24000.00"), new BigDecimal("60000.00"), blrKora, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Modular Kitchen, Balcony, 24h Water, Security, Quiet Lane", LocalDate.now().plusDays(8));
        Accommodation a10 = createAccommodationIfAbsent(provider, "Techie Co-Living Studio in Indiranagar 100ft Rd", "Designer single-occupancy studio with dedicated work desk, ergonomic chair, smart TV, and 300 Mbps broadband. Utilities included.", AccommodationType.PG, new BigDecimal("22500.00"), new BigDecimal("30000.00"), blrIndira, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Ergonomic Desk, Smart TV, 300 Mbps WiFi, Daily Cleaning, Power Backup", LocalDate.now().plusDays(3));
        Accommodation a11 = createAccommodationIfAbsent(provider, "Spacious 2BHK Gated Society in HITECH City", "Furnished 2BHK near Cyber Towers and Mindspace SEZ. Clubhouse, badminton court, supermarket inside society, and 100% power backup.", AccommodationType.FLAT, new BigDecimal("26000.00"), new BigDecimal("45000.00"), hyd, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Power Backup, Clubhouse, Grocery inside, Swimming Pool, Car Parking", LocalDate.now().plusDays(12));
        Accommodation a12 = createAccommodationIfAbsent(provider, "Single Room in Shared Villa near Velachery Metro", "Private room in an independent duplex villa. Calm neighborhood, covered bike parking, high speed internet, and terrace garden access.", AccommodationType.ROOM, new BigDecimal("10500.00"), new BigDecimal("18000.00"), chennai, FurnishingStatus.SEMI_FURNISHED, GenderPreference.MALE, "Terrace Garden, Covered Parking, Washing Machine, Geyser, RO Water", LocalDate.now().plusDays(9));
        Accommodation a13 = createAccommodationIfAbsent(provider, "Connaught Place Heritage Studio Flat", "Unique studio apartment with high ceilings in central Delhi. Walking distance to Barakhamba and Rajiv Chowk metro stations.", AccommodationType.FLAT, new BigDecimal("27000.00"), new BigDecimal("50000.00"), delhi, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Near Metro, AC, Refrigerator, Micro-oven, Gated Colony", LocalDate.now().plusDays(14));
        Accommodation a14 = createAccommodationIfAbsent(provider, "Modern 2BHK Society Apartment in Noida Sec 62", "Close to metro station and major IT campuses. Society features 24x7 security, jogging track, dedicated parking, and power backup.", AccommodationType.FLAT, new BigDecimal("21000.00"), new BigDecimal("35000.00"), noida, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Power Backup, Jogging Track, Lift, Gated Security, Near Metro", LocalDate.now().plusDays(7));
        Accommodation a15 = createAccommodationIfAbsent(provider, "Executive Co-Living Suite near Cyber City Gurugram", "Air-conditioned private room with attached washroom in DLF Phase 2. 5 mins commute to Cyber Hub. Continental breakfast included.", AccommodationType.PG, new BigDecimal("18000.00"), new BigDecimal("25000.00"), gurugram, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Breakfast Included, AC, Power Backup, Housekeeping, Gym, Security", LocalDate.now().plusDays(5));
        Accommodation a16 = createAccommodationIfAbsent(provider, "Spacious 2BHK Villa Flat on College Road Nashik", "Peaceful, sunlit 2BHK with mountain view. Ample ventilation, modular kitchen, parking for car and bike. Very low maintenance.", AccommodationType.FLAT, new BigDecimal("12500.00"), new BigDecimal("20000.00"), nashik, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Mountain View, Car Parking, Solar Water, Piped Gas, Garden", LocalDate.now().plusDays(11));
        Accommodation a17 = createAccommodationIfAbsent(aarav, "1BHK Cozy Flat near Wakad Bridge", "Ideal for bachelor or couple working in Pune IT park. Gated society, lift with generator backup, and piped gas connection.", AccommodationType.FLAT, new BigDecimal("15500.00"), new BigDecimal("28000.00"), puneWakad, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Lift, Power Backup, Gas Pipeline, Water Purifier, Security", LocalDate.now().plusDays(4));
        Accommodation a18 = createAccommodationIfAbsent(provider, "Twin Sharing PG for IT Women in Hinjawadi Phase 2", "Right across from Cognizant and TCS. 3 nutritious meals a day, high-speed WiFi, laundry facility, and 24x7 female warden.", AccommodationType.PG, new BigDecimal("8500.00"), new BigDecimal("12000.00"), puneHinj, FurnishingStatus.FULLY_FURNISHED, GenderPreference.FEMALE, "3 Meals, Female Warden, Biometric Security, WiFi, Geyser", LocalDate.now().plusDays(2));
        Accommodation a19 = createAccommodationIfAbsent(aarav, "Luxury 3BHK Penthouse in Baner Balewadi", "Top-floor penthouse with private terrace garden, modular island kitchen, and jacuzzi bath. For senior executives relocating to Pune.", AccommodationType.FLAT, new BigDecimal("36000.00"), new BigDecimal("70000.00"), puneBaner, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Private Terrace, Jacuzzi, Modular Kitchen, 2 Covered Parkings, Gym", LocalDate.now().plusDays(15));
        Accommodation a20 = createAccommodationIfAbsent(provider, "Affordable 1RK Room in Kharadi near World Trade Center", "Clean 1RK with private kitchenette and bath. Walking distance to WTC and Zensar. Great value for young IT professionals.", AccommodationType.ROOM, new BigDecimal("9000.00"), new BigDecimal("15000.00"), puneKharadi, FurnishingStatus.SEMI_FURNISHED, GenderPreference.ANY, "Private Kitchenette, Attached Bath, 24h Water, Bike Parking", LocalDate.now().plusDays(3));
        Accommodation a21 = createAccommodationIfAbsent(rahul, "Furnished Single Room in Powai Hiranandani", "Private bedroom in 3BHK luxury apartment in Hiranandani Gardens. Access to clubhouse, tennis court, and lakeside promenade.", AccommodationType.ROOM, new BigDecimal("23000.00"), new BigDecimal("40000.00"), mumbaiAndheri, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Clubhouse Access, Tennis Court, Lake View, AC, WiFi, Maid Service", LocalDate.now().plusDays(8));
        Accommodation a22 = createAccommodationIfAbsent(priya, "Penthouse Room in HSR Layout Sector 1", "Room with private terrace balcony in HSR Sector 1. High speed internet, shared hall with projector, and friendly tech roommates.", AccommodationType.ROOM, new BigDecimal("16500.00"), new BigDecimal("30000.00"), blrKora, FurnishingStatus.FULLY_FURNISHED, GenderPreference.ANY, "Private Terrace, Projector Lounge, 300 Mbps Fiber, Cook Available", LocalDate.now().plusDays(6));

        // Save realistic favorites for the demo user
        if (user != null) {
            saveAccommodationFavoriteIfAbsent(user, a1);
            saveAccommodationFavoriteIfAbsent(user, a2);
            saveAccommodationFavoriteIfAbsent(user, a3);
        }
    }

    private Accommodation createAccommodationIfAbsent(User owner, String title, String description, AccommodationType type, BigDecimal rent, BigDecimal deposit, Location location, FurnishingStatus furnished, GenderPreference genderPref, String facilities, LocalDate availableFrom) {
        if (owner == null || location == null) return null;
        return accommodationRepository.findFirstByTitle(title).orElseGet(() -> {
            Accommodation acc = new Accommodation(owner, title, description, type, rent, deposit, location);
            acc.setFurnished(furnished);
            acc.setGenderPreference(genderPref);
            acc.setFacilities(facilities);
            acc.setAvailableFrom(availableFrom);
            return accommodationRepository.save(acc);
        });
    }

    private void saveAccommodationFavoriteIfAbsent(User user, Accommodation accommodation) {
        if (user == null || accommodation == null) return;
        if (!accommodationFavoriteRepository.existsByUserIdAndAccommodationId(user.getId(), accommodation.getId())) {
            AccommodationFavorite fav = new AccommodationFavorite(user, accommodation);
            accommodationFavoriteRepository.save(fav);
        }
    }

    private void seedServices() {
        User provider = userRepository.findByEmail("provider.services@example.com").orElse(null);
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);

        Location puneHinj = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Hinjawadi").orElse(null);
        Location puneWakad = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Wakad").orElse(null);
        Location puneBaner = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Baner").orElse(null);
        Location puneKharadi = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Kharadi").orElse(null);
        Location puneKothrud = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Kothrud").orElse(null);
        Location puneViman = locationRepository.findFirstByCityAndStateAndArea("Pune", "Maharashtra", "Viman Nagar").orElse(null);
        Location mumbaiAndheri = locationRepository.findFirstByCityAndStateAndArea("Mumbai", "Maharashtra", "Andheri East").orElse(null);
        Location mumbaiBandra = locationRepository.findFirstByCityAndStateAndArea("Mumbai", "Maharashtra", "Bandra West").orElse(null);
        Location blrKora = locationRepository.findFirstByCityAndStateAndArea("Bengaluru", "Karnataka", "Koramangala").orElse(null);
        Location hyd = locationRepository.findFirstByCityAndStateAndArea("Hyderabad", "Telangana", "HITECH City").orElse(null);
        Location delhi = locationRepository.findFirstByCityAndStateAndArea("Delhi", "Delhi", "Connaught Place").orElse(null);

        // 22 Realistic Local Services
        Recommendation s1 = createServiceIfAbsent(provider, puneHinj, "Express Packers & Movers Pune", ServiceCategory.ESSENTIAL_SERVICES, "Packers & Movers", "Hinjawadi Phase 1 Main Road, Pune", "+91 91234 56789", "https://expresspackers.example.com", "Professional house relocation, packing, bubble-wrapping, loading, and safe transport across Pune & Mumbai.", "8:00 AM - 9:00 PM", new BigDecimal("4.9"));
        Recommendation s2 = createServiceIfAbsent(provider, puneWakad, "FreshBites Daily Tiffin & Meal Delivery", ServiceCategory.FOOD, "Tiffin Service", "Wakad Chowk, Pune", "+91 91234 56790", "https://freshbites.example.com", "Hygienic, home-cooked North and South Indian thali meals delivered twice daily to flats and PGs.", "7:00 AM - 10:00 PM", new BigDecimal("4.8"));
        Recommendation s3 = createServiceIfAbsent(provider, puneBaner, "SpeedyFiber Broadband & Internet Setup", ServiceCategory.ESSENTIAL_SERVICES, "Internet Service", "Baner High Street, Pune", "+91 91234 56791", "https://speedyfiber.example.com", "Same-day optical fiber broadband installation up to 500 Mbps with zero installation deposit for relocators.", "9:00 AM - 8:00 PM", new BigDecimal("4.7"));
        Recommendation s4 = createServiceIfAbsent(provider, puneHinj, "SparkleClean Home Deep Cleaning & Sanitization", ServiceCategory.ESSENTIAL_SERVICES, "Cleaning Service", "Near Mezza 9, Hinjawadi Phase 1, Pune", "+91 91234 56792", "https://sparkleclean.example.com", "Deep cleaning for newly leased apartments: kitchen degreasing, bathroom scrubbing, floor polishing, and sanitization.", "8:00 AM - 7:00 PM", new BigDecimal("4.9"));
        Recommendation s5 = createServiceIfAbsent(provider, puneWakad, "QuickFix Electrical & Appliance Repair", ServiceCategory.ESSENTIAL_SERVICES, "Electrician", "Datta Mandir Road, Wakad, Pune", "+91 91234 56793", "https://quickfix.example.com", "Licensed electricians for geyser repair, AC servicing, fan installation, switchboard repair, and wiring.", "8:00 AM - 9:00 PM", new BigDecimal("4.8"));
        Recommendation s6 = createServiceIfAbsent(provider, puneKharadi, "FlowRight Emergency Plumbing & Water Services", ServiceCategory.ESSENTIAL_SERVICES, "Plumber", "Near EON Free Zone, Kharadi, Pune", "+91 91234 56794", "https://flowright.example.com", "Emergency leak repairs, water purifier RO installation, tap and shower fitting, and drainage clearance.", "24 Hours Open", new BigDecimal("4.7"));
        Recommendation s7 = createServiceIfAbsent(provider, puneViman, "UrbanSpin Dry Cleaning & Daily Laundry Express", ServiceCategory.ESSENTIAL_SERVICES, "Laundry", "Viman Nagar Road, Pune", "+91 91234 56795", "https://urbanspin.example.com", "Wash, fold, steam ironing and shoe cleaning with free pickup and 24-hour delivery to your doorstep.", "9:00 AM - 9:00 PM", new BigDecimal("4.8"));
        Recommendation s8 = createServiceIfAbsent(provider, puneBaner, "RentFurnish Furniture & Appliance Rental", ServiceCategory.ESSENTIAL_SERVICES, "Furniture Rental", "Pan Card Club Road, Baner, Pune", "+91 91234 56796", "https://rentfurnish.example.com", "Affordable monthly rentals for beds, mattresses, study tables, sofas, refrigerators, and washing machines.", "9:30 AM - 8:00 PM", new BigDecimal("4.6"));
        Recommendation s9 = createServiceIfAbsent(provider, puneHinj, "Lifeline 24x7 Multi-Specialty Clinic & Pharmacy", ServiceCategory.HEALTHCARE, "Medical Clinic", "Hinjawadi IT Park, Phase 1, Pune", "+91 91234 56797", "https://lifelineclinic.example.com", "24-hour general physician consultation, blood testing lab, pharmacy, and urgent care for young professionals.", "24 Hours Open", new BigDecimal("4.9"));
        Recommendation s10 = createServiceIfAbsent(provider, puneKothrud, "GreenBasket Fresh Vegetables & Daily Groceries", ServiceCategory.GROCERY, "Supermarket", "Near Karve Statue, Kothrud, Pune", "+91 91234 56798", "https://greenbasket.example.com", "Daily fresh farm-sourced vegetables, fruits, dairy, and regional spices with instant doorstep delivery.", "7:00 AM - 10:30 PM", new BigDecimal("4.8"));
        Recommendation s11 = createServiceIfAbsent(provider, puneBaner, "FitPulse 24x7 Gym & Functional Training", ServiceCategory.FITNESS, "Gym", "Balewadi High Street, Pune", "+91 91234 56799", "https://fitpulse.example.com", "State-of-the-art gym equipment, cardio zone, certified personal trainers, steam room, and monthly memberships.", "5:30 AM - 11:00 PM", new BigDecimal("4.9"));
        Recommendation s12 = createServiceIfAbsent(provider, mumbaiBandra, "MetroMovers Relocation Mumbai", ServiceCategory.ESSENTIAL_SERVICES, "Packers & Movers", "Hill Road, Bandra West, Mumbai", "+91 98200 12345", "https://metromovers.example.com", "Specialized intercity and intra-Mumbai moving services with full transit insurance and experienced packers.", "8:00 AM - 8:00 PM", new BigDecimal("4.8"));
        Recommendation s13 = createServiceIfAbsent(provider, mumbaiAndheri, "Aroma Kitchen North Indian Tiffin Express", ServiceCategory.FOOD, "Tiffin Service", "Chakala, Andheri East, Mumbai", "+91 98200 12346", "https://aromakitchen.example.com", "Wholesome home-style roti, subzi, dal, and rice prepared fresh every morning and evening.", "7:30 AM - 9:30 PM", new BigDecimal("4.7"));
        Recommendation s14 = createServiceIfAbsent(provider, blrKora, "Bangalore Relocation & Safe Storage Hub", ServiceCategory.ESSENTIAL_SERVICES, "Packers & Movers", "80 Feet Road, Koramangala, Bengaluru", "+91 98450 12347", "https://blrstorage.example.com", "Short-term furniture storage units and house shifting with GPS-tracked container trucks.", "8:30 AM - 8:30 PM", new BigDecimal("4.9"));
        Recommendation s15 = createServiceIfAbsent(provider, blrKora, "DailyDabba Healthy South & North Tiffins", ServiceCategory.FOOD, "Tiffin Service", "Koramangala 5th Block, Bengaluru", "+91 98450 12348", "https://dailydabba.example.com", "Nutritious corporate meal boxes, millet options, salads, and traditional Indian thalis.", "7:00 AM - 10:00 PM", new BigDecimal("4.8"));
        Recommendation s16 = createServiceIfAbsent(provider, hyd, "HITECH City Techie Home Helpers & Maids", ServiceCategory.ESSENTIAL_SERVICES, "Housekeeping", "Madhapur Main Road, Hyderabad", "+91 98490 12349", "https://techiehelpers.example.com", "Background-verified domestic helpers, cooks, and cleaning professionals on monthly retainers.", "8:00 AM - 8:00 PM", new BigDecimal("4.7"));
        Recommendation s17 = createServiceIfAbsent(provider, hyd, "CarePlus 24x7 Diagnostic & Medical Center", ServiceCategory.HEALTHCARE, "Clinic", "Kondapur, Hyderabad", "+91 98490 12350", "https://careplus.example.com", "Emergency healthcare, doctor on call, pathology lab, and 24-hour prescription delivery.", "24 Hours Open", new BigDecimal("4.9"));
        Recommendation s18 = createServiceIfAbsent(provider, delhi, "Capital Care Appliance Repair & Electricals", ServiceCategory.ESSENTIAL_SERVICES, "Electrician", "Barakhamba Road, Connaught Place, Delhi", "+91 98100 12351", "https://capitalcare.example.com", "Fast repair services for ACs, refrigerators, microwave ovens, washing machines, and inverters.", "9:00 AM - 8:00 PM", new BigDecimal("4.6"));
        Recommendation s19 = createServiceIfAbsent(provider, puneHinj, "CityTransit Daily Shared Shuttles & Cabs", ServiceCategory.TRANSPORT, "Transport", "Hinjawadi Phase 3 Circle, Pune", "+91 91234 56800", "https://citytransit.example.com", "Air-conditioned commuter cabs running daily between Wakad, Baner, Aundh, and Hinjawadi IT Park.", "6:00 AM - 10:00 PM", new BigDecimal("4.8"));
        Recommendation s20 = createServiceIfAbsent(provider, puneBaner, "State Bank of India & 24x7 ATM Hub", ServiceCategory.FINANCIAL, "Bank & ATM", "Baner Road near Sadanand Resort, Pune", "+91 91234 56801", "https://sbi.co.in", "Full banking services, locker availability, cash deposit machine, and 24-hour multi-bank ATM.", "10:00 AM - 4:00 PM", new BigDecimal("4.5"));
        Recommendation s21 = createServiceIfAbsent(provider, puneWakad, "MediQuick 24-Hour Emergency Pharmacy", ServiceCategory.EMERGENCY, "Pharmacy", "Near Bhumkar Chowk, Wakad, Pune", "+91 91234 56802", "https://mediquick.example.com", "Round the clock emergency medications, baby supplies, first-aid, oxygen cans, and nebulizer rentals.", "24 Hours Open", new BigDecimal("4.9"));
        Recommendation s22 = createServiceIfAbsent(provider, puneViman, "SkillBridge Tech & Language Learning Center", ServiceCategory.EDUCATION, "Training Center", "Viman Nagar, Pune", "+91 91234 56803", "https://skillbridge.example.com", "Professional certifications in AWS, Java, Python, and German language training for engineers moving abroad.", "9:00 AM - 7:00 PM", new BigDecimal("4.8"));

        // Save favorites for demo user
        if (user != null) {
            saveServiceFavoriteIfAbsent(user, s1);
            saveServiceFavoriteIfAbsent(user, s2);
            saveServiceFavoriteIfAbsent(user, s3);
        }
    }

    private Recommendation createServiceIfAbsent(User creator, Location location, String title, ServiceCategory category, String subcategory, String address, String phone, String website, String description, String hours, BigDecimal rating) {
        if (creator == null || location == null) return null;
        return recommendationRepository.findFirstByTitle(title).orElseGet(() -> {
            Recommendation rec = new Recommendation(creator, location, title, category);
            rec.setSubcategory(subcategory);
            rec.setAddress(address);
            rec.setPhone(phone);
            rec.setWebsite(website);
            rec.setDescription(description);
            rec.setOpeningHours(hours);
            rec.setRating(rating);
            return recommendationRepository.save(rec);
        });
    }

    private void saveServiceFavoriteIfAbsent(User user, Recommendation service) {
        if (user == null || service == null) return;
        if (!recommendationFavoriteRepository.existsByUserIdAndRecommendationId(user.getId(), service.getId())) {
            RecommendationFavorite fav = new RecommendationFavorite(user, service);
            recommendationFavoriteRepository.save(fav);
        }
    }

    private void seedEvents() {
        Community puneIt = communityRepository.findBySlug("pune-it-professionals").orElse(null);
        Community puneNew = communityRepository.findBySlug("pune-newcomers").orElse(null);
        Community students = communityRepository.findBySlug("students-pune").orElse(null);
        Community mumbaiNew = communityRepository.findBySlug("mumbai-new-residents").orElse(null);
        Community womenMumbai = communityRepository.findBySlug("women-relocating-mumbai").orElse(null);
        Community blrTech = communityRepository.findBySlug("bengaluru-tech-hub").orElse(null);
        Community freshers = communityRepository.findBySlug("freshers-graduates").orElse(null);
        Community hyderabad = communityRepository.findBySlug("hyderabad-job-seekers").orElse(null);
        Community delhiNew = communityRepository.findBySlug("delhi-ncr-newcomers").orElse(null);
        Community chennaiTech = communityRepository.findBySlug("chennai-tech-community").orElse(null);
        Community nashikComm = communityRepository.findBySlug("nashik-local-community").orElse(null);

        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User rahul = userRepository.findByEmail("rahul.deshmukh@example.com").orElse(null);
        User ananya = userRepository.findByEmail("ananya.verma@example.com").orElse(null);
        User neha = userRepository.findByEmail("neha.kapoor@example.com").orElse(null);
        User karthik = userRepository.findByEmail("karthik.rajan@example.com").orElse(null);
        User tanvi = userRepository.findByEmail("tanvi.kulkarni@example.com").orElse(null);
        User aditya = userRepository.findByEmail("aditya.mehta@example.com").orElse(null);
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);

        // 16 Events (11 Upcoming, 5 Past)
        createEventWithRsvps(puneNew, admin, "Pune Weekend Newcomers Coffee Meetup", "Third Wave Coffee, High Street Baner, Pune", LocalDateTime.now().plusDays(4).withHour(16).withMinute(0), "Friendly informal coffee meetup for everyone who recently relocated to Pune. Meet fellow software developers, students, and professionals!", 45, List.of(admin, user, aarav, ananya));
        createEventWithRsvps(puneIt, aarav, "Hinjawadi Tech Roundtable: Spring Boot & Cloud AI", "Cowork Zone, Phase 1, Hinjawadi, Pune", LocalDateTime.now().plusDays(8).withHour(18).withMinute(30), "Deep-dive tech discussion on scalable backend architectures, microservices, and AI integrations. Networking & pizza included.", 35, List.of(aarav, user, karthik));
        createEventWithRsvps(students, ananya, "Campus Newcomers Orientation & Ice-breaker Evening", "Viman Nagar Central Garden, Pune", LocalDateTime.now().plusDays(6).withHour(17).withMinute(0), "Fun evening for new students in Pune. Group ice-breakers, study tips, budget hacks, and snacks.", 50, List.of(ananya, user));
        createEventWithRsvps(mumbaiNew, rahul, "Marine Drive Sunset Walk & Mumbai Street Food Social", "Chowpatty Promenade, Marine Drive, Mumbai", LocalDateTime.now().plusDays(5).withHour(17).withMinute(30), "Catch the famous Marine Drive sunset, chat with fellow newcomers, and try classic Mumbai street food.", 40, List.of(rahul, aditya, user));
        createEventWithRsvps(womenMumbai, neha, "Women in Mumbai: Flatmate Mixer & City Safety Panel", "WeWork Enam Sambhav, BKC, Mumbai", LocalDateTime.now().plusDays(10).withHour(15).withMinute(0), "Meet prospective female flatmates, discuss neighborhood safety, and network with women leaders in Mumbai.", 30, List.of(neha, priya, ananya));
        createEventWithRsvps(blrTech, priya, "Bangalore Product & Design Breakfast Club", "Third Wave Coffee, 4th Block Koramangala, Bengaluru", LocalDateTime.now().plusDays(7).withHour(10).withMinute(0), "Casual morning meetup for product designers, engineers, and startup operators. Design portfolio reviews & coffee.", 25, List.of(priya, karthik, user));
        createEventWithRsvps(freshers, ananya, "Resume Review & Mock Tech Interview Session", "Online Google Meet Session", LocalDateTime.now().plusDays(3).withHour(19).withMinute(0), "Senior engineers volunteer to review resumes and conduct quick 15-minute mock interview sessions for freshers.", 60, List.of(ananya, user, aarav));
        createEventWithRsvps(hyderabad, admin, "Hyderabad Newcomers Biryani & Networking Dinner", "Paradise Food Court, Secunderabad, Hyderabad", LocalDateTime.now().plusDays(12).withHour(20).withMinute(0), "Nothing brings people together like authentic Hyderabadi Biryani! Connect with relocators across Hyderabad tech companies.", 35, List.of(admin, user));
        createEventWithRsvps(delhiNew, neha, "Delhi Heritage Walk: Lodhi Garden Architecture & Art", "Lodhi Garden Main Gate, New Delhi", LocalDateTime.now().plusDays(9).withHour(8).withMinute(30), "Morning photography walk through 15th century tombs, followed by breakfast at Khan Market.", 30, List.of(neha, admin));
        createEventWithRsvps(chennaiTech, karthik, "Chennai Open Source Weekend Hackathon", "OMR Tech Park, Sholinganallur, Chennai", LocalDateTime.now().plusDays(15).withHour(10).withMinute(0), "Full day collaborative coding session on public good open-source projects. Free food & mentor guidance.", 50, List.of(karthik, user));
        createEventWithRsvps(nashikComm, tanvi, "Vineyard Tour & Tasting for Remote Workers in Nashik", "Sula Vineyards, Govardhan Village, Nashik", LocalDateTime.now().plusDays(18).withHour(11).withMinute(0), "Weekend tour of Nashik's premier vineyard. Great opportunity to relax and connect with fellow remote residents.", 25, List.of(tanvi, rahul));

        // 5 Past Events
        createEventWithRsvps(puneNew, admin, "Pune Monsoon Trek to Sinhagad Fort", "Sinhagad Base Point, Pune", LocalDateTime.now().minusDays(5).withHour(6).withMinute(30), "Completed: Reached the historic fort top, enjoyed hot pithla bhakri and kanda bhaji with 28 members.", 30, List.of(admin, user, aarav));
        createEventWithRsvps(blrTech, priya, "Bengaluru Tech Founders & Angel Mixer", "Indiranagar Club, Bengaluru", LocalDateTime.now().minusDays(10).withHour(18).withMinute(0), "Completed: Networking evening with 35 engineers and founders exploring seed-stage ideas.", 40, List.of(priya, karthik));
        createEventWithRsvps(mumbaiNew, aditya, "Bandra Heritage Photo Walk & Street Art Tour", "Bandra Fort, Mumbai", LocalDateTime.now().minusDays(14).withHour(16).withMinute(30), "Completed: Explored Bandra street art and historic Portuguese churches.", 25, List.of(aditya, rahul));
        createEventWithRsvps(puneIt, aarav, "Frontend Frameworks 2026: React 18, Vite & CSS Mastery", "Tech Hub, Baner, Pune", LocalDateTime.now().minusDays(20).withHour(15).withMinute(0), "Completed: Interactive workshop on high-performance frontend engineering.", 35, List.of(aarav, user));
        createEventWithRsvps(students, ananya, "Campus Book Swap & Study Resource Exchange", "COEP Grounds, Shivajinagar, Pune", LocalDateTime.now().minusDays(25).withHour(16).withMinute(0), "Completed: Exchanged over 60 engineering, medical, and literature textbooks.", 40, List.of(ananya, user));
    }

    private void createEventWithRsvps(Community community, User creator, String title, String location, LocalDateTime eventDate, String description, int capacity, List<User> attendees) {
        if (community == null || creator == null) return;
        Event event = eventRepository.findFirstByTitle(title).orElseGet(() -> {
            Event e = new Event(community, creator, title, location, eventDate);
            e.setDescription(description);
            e.setCapacity(capacity);
            e.setStatus(eventDate.isBefore(LocalDateTime.now()) ? EventStatus.COMPLETED : EventStatus.UPCOMING);
            return eventRepository.save(e);
        });

        if (attendees != null) {
            for (User attendee : attendees) {
                if (attendee != null && !eventMemberRepository.existsByEventIdAndUserId(event.getId(), attendee.getId())) {
                    EventMember member = new EventMember(event, attendee, RsvpStatus.ATTENDING);
                    eventMemberRepository.save(member);
                }
            }
        }
    }

    private void seedConversationsAndMessages() {
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);
        User aarav = userRepository.findByEmail("aarav.patil@example.com").orElse(null);
        User provider = userRepository.findByEmail("provider.services@example.com").orElse(null);
        User priya = userRepository.findByEmail("priya.sharma@example.com").orElse(null);
        User ananya = userRepository.findByEmail("ananya.verma@example.com").orElse(null);
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);
        User rahul = userRepository.findByEmail("rahul.deshmukh@example.com").orElse(null);
        User aditya = userRepository.findByEmail("aditya.mehta@example.com").orElse(null);

        // Conversation 1: Rohan Sharma <-> Aarav Patil (Wakad housing recommendations)
        createDirectChatIfAbsent(user, aarav, List.of(
                new ChatMessageData(user, "Hi Aarav! I saw your post in Pune Newcomers. Are Wakad PGs safe and well-connected to Hinjawadi Phase 1?"),
                new ChatMessageData(aarav, "Hey Rohan! Yes, Wakad is super safe and the top choice for IT employees. Lots of tech shuttles and good dining options."),
                new ChatMessageData(user, "That's great! Do you know if societies near Datta Mandir road have power backup?"),
                new ChatMessageData(aarav, "Almost all multi-story societies there have 100% DG power backup. Let me know when you arrive, we can grab a coffee in Baner!")
        ));

        // Conversation 2: Rohan Sharma <-> MoveMate Verified Services (Inquiry about packing & tiffin)
        createDirectChatIfAbsent(user, provider, List.of(
                new ChatMessageData(user, "Hello! I am shifting household items from Mumbai to Wakad Pune next weekend. What would be the approximate quote for a 1BHK?"),
                new ChatMessageData(provider, "Hello Rohan! For a 1BHK relocation from Mumbai to Wakad with complete packing, loading, transport, and insurance, it is typically around ₹14,500 to ₹16,000."),
                new ChatMessageData(user, "Does that include bubble-wrapping for monitors and electronic appliances?"),
                new ChatMessageData(provider, "Yes, 3-layer bubble wrap with dedicated carton crating for TV, monitors, and laptops is included.")
        ));

        // Conversation 3: Rohan Sharma <-> Priya Sharma (Comparing Bangalore vs Pune for software developers)
        createDirectChatIfAbsent(user, priya, List.of(
                new ChatMessageData(user, "Hey Priya! Saw your posts about Bengaluru tech scene. I had an offer in Bangalore too but chose Pune due to proximity to my parents in Mumbai."),
                new ChatMessageData(priya, "Hey Rohan! Pune is a fantastic choice. The cost of living is much lower, commute times are sane, and weather is lovely year-round."),
                new ChatMessageData(user, "Thanks! Feeling much more confident about the move now.")
        ));

        // Conversation 4: Ananya Verma <-> Admin (Community guidelines question)
        createDirectChatIfAbsent(ananya, admin, List.of(
                new ChatMessageData(ananya, "Hello Admin! Can we organize a second-hand engineering textbook exchange event in Students in Pune community?"),
                new ChatMessageData(admin, "Hi Ananya! Absolutely, that's a wonderful initiative. Please create the event directly in the community and we will feature it on the home page.")
        ));

        // Conversation 5: Rahul Deshmukh <-> Aditya Mehta (Mumbai weekend photowalk)
        createDirectChatIfAbsent(rahul, aditya, List.of(
                new ChatMessageData(rahul, "Hey Aditya, are we meeting at Bandstand or Mount Mary for the Saturday photowalk?"),
                new ChatMessageData(aditya, "Mount Mary church steps at 5 PM sharp, so we catch the golden hour light over Bandstand!")
        ));
    }

    private void createDirectChatIfAbsent(User user1, User user2, List<ChatMessageData> messages) {
        if (user1 == null || user2 == null) return;
        Conversation conv = conversationRepository.findDirectConversationBetweenUsers(user1.getId(), user2.getId()).orElseGet(() -> {
            Conversation c = new Conversation(ConversationType.DIRECT);
            Conversation saved = conversationRepository.save(c);

            ConversationMember m1 = new ConversationMember(saved, user1);
            ConversationMember m2 = new ConversationMember(saved, user2);
            conversationMemberRepository.saveAll(List.of(m1, m2));
            return saved;
        });

        if (messages != null && messageRepository.findByConversationIdOrderByCreatedAtDesc(conv.getId(), org.springframework.data.domain.PageRequest.of(0, 10)).isEmpty()) {
            for (ChatMessageData md : messages) {
                if (md.sender != null) {
                    Message m = new Message(conv, md.sender, md.content, MessageType.TEXT);
                    messageRepository.save(m);
                }
            }
        }
    }

    private static class ChatMessageData {
        User sender;
        String content;
        ChatMessageData(User sender, String content) {
            this.sender = sender;
            this.content = content;
        }
    }

    private void seedNotifications() {
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);
        if (user != null && notificationRepository.countByRecipientIdAndIsReadFalse(user.getId()) == 0) {
            Notification n1 = new Notification(user, NotificationType.SYSTEM, "Welcome to MoveMate!", "Your relocation profile is live. Explore Pune communities, discover housing in Wakad & Baner, and meet local residents.", 1L);
            notificationRepository.save(n1);

            Notification n2 = new Notification(user, NotificationType.EVENT_CREATED, "Upcoming Community Meetup", "Pune Weekend Newcomers Coffee Meetup is scheduled for this Saturday in Baner.", 1L);
            notificationRepository.save(n2);

            Notification n3 = new Notification(user, NotificationType.NEW_MESSAGE, "New Message from Aarav Patil", "Aarav Patil replied to your query regarding Wakad PG accommodations.", 1L);
            notificationRepository.save(n3);

            Notification n4 = new Notification(user, NotificationType.POST_LIKED, "Someone liked your post", "Aarav Patil and 2 others liked your post 'Moving to Pune next Monday'.", 1L);
            notificationRepository.save(n4);

            Notification n5 = new Notification(user, NotificationType.POST_COMMENTED, "New comment on your post", "Aarav Patil commented on your housing inquiry.", 1L);
            notificationRepository.save(n5);
        }
    }

    private void seedModerationReportsAndAuditLogs() {
        User admin = userRepository.findByEmail("admin@movemate.com").orElse(null);
        User user = userRepository.findByEmail("user@movemate.com").orElse(null);

        // 3 Moderation Reports
        if (user != null && reportRepository.count() == 0) {
            Report r1 = new Report(user, ReportTargetType.POST, 1L, "Commercial Broker Advertisement", "User posting commercial broker phone numbers without license in community feed.");
            r1.setStatus(ReportStatus.PENDING);
            reportRepository.save(r1);

            Report r2 = new Report(user, ReportTargetType.COMMENT, 2L, "Off-topic solicitation", "Irrelevant sales link posted in discussion thread.");
            r2.setStatus(ReportStatus.RESOLVED);
            reportRepository.save(r2);

            Report r3 = new Report(user, ReportTargetType.POST, 3L, "Duplicate post", "User submitted the same post multiple times across groups.");
            r3.setStatus(ReportStatus.DISMISSED);
            reportRepository.save(r3);
        }

        // 4 Security Audit Logs
        if (admin != null && auditLogRepository.count() == 0) {
            AuditLog l1 = new AuditLog(admin, "ADMIN_LOGIN", "SYSTEM", 1L, "Administrative governance session initialized from corporate gateway.");
            auditLogRepository.save(l1);

            AuditLog l2 = new AuditLog(admin, "COMMUNITY_VERIFIED", "COMMUNITY", 1L, "Verified status confirmed for Pune IT Professionals leadership.");
            auditLogRepository.save(l2);

            AuditLog l3 = new AuditLog(admin, "RESOLVE_REPORT", "REPORT", 2L, "Report #2 marked RESOLVED: Inappropriate solicitation removed.");
            auditLogRepository.save(l3);

            AuditLog l4 = new AuditLog(admin, "SYSTEM_HEALTH_CHECK", "SYSTEM", 1L, "Routine security integrity audit completed across auth and database layers.");
            auditLogRepository.save(l4);
        }
    }
}
