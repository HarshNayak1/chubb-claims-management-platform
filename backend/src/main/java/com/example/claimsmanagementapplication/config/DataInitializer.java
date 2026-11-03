package com.example.claimsmanagementapplication.config;

import com.example.claimsmanagementapplication.entity.Claim;
import com.example.claimsmanagementapplication.entity.ClaimHistory;
import com.example.claimsmanagementapplication.entity.User;
import com.example.claimsmanagementapplication.enums.ClaimStatus;
import com.example.claimsmanagementapplication.enums.ClaimType;
import com.example.claimsmanagementapplication.enums.Role;
import com.example.claimsmanagementapplication.repository.ClaimHistoryRepository;
import com.example.claimsmanagementapplication.repository.ClaimRepository;
import com.example.claimsmanagementapplication.repository.UserRepository;
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
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final ClaimRepository claimRepository;
    private final ClaimHistoryRepository claimHistoryRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           ClaimRepository claimRepository,
                           ClaimHistoryRepository claimHistoryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.claimRepository = claimRepository;
        this.claimHistoryRepository = claimHistoryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        seedUsers();
        seedEmployees();
        seedManagers();
        seedSampleClaims();
    }

    private void seedUsers() {
        String[] userNames = {
                "Alice Tan", "Benjamin Lee", "Chloe Wong", "David Chen", "Emily Zhang",
                "Farhan Malik", "Grace Lim", "Haruto Tanaka", "Isabella Rossi", "James Wilson"
        };
        String userPasswordHash = passwordEncoder.encode("User@123");

        for (int i = 1; i <= 10; i++) {
            String email = String.format("user%02d@chubb.com", i);
            if (!userRepository.existsByEmail(email)) {
                User user = new User(
                        userNames[i - 1],
                        email,
                        userPasswordHash,
                        Role.USER,
                        true
                );
                user.setCreatedAt(LocalDateTime.now().minusDays(30 - i));
                userRepository.save(user);
                log.info("Seeded user account: {}", email);
            }
        }
    }

    private void seedEmployees() {
        String[] empNames = {
                "Marcus Vance", "Sarah Jenkins", "Liam O'Connor", "Aisha Patel", "Daniel Kim",
                "Rachel Green", "Thomas Wright", "Olivia Taylor", "Kenji Sato", "Jessica Brown"
        };
        String empPasswordHash = passwordEncoder.encode("Employee@123");

        for (int i = 1; i <= 10; i++) {
            String email = String.format("employee%02d@chubb.com", i);
            if (!userRepository.existsByEmail(email)) {
                User emp = new User(
                        empNames[i - 1],
                        email,
                        empPasswordHash,
                        Role.EMPLOYEE,
                        true
                );
                emp.setCreatedAt(LocalDateTime.now().minusDays(60 - i));
                userRepository.save(emp);
                log.info("Seeded employee account: {}", email);
            }
        }
    }

    private void seedManagers() {
        String[] mgrNames = {"Victoria Sterling", "Alexander Hughes"};
        String mgrPasswordHash = passwordEncoder.encode("Manager@123");

        for (int i = 1; i <= 2; i++) {
            String email = String.format("manager%02d@chubb.com", i);
            if (!userRepository.existsByEmail(email)) {
                User mgr = new User(
                        mgrNames[i - 1],
                        email,
                        mgrPasswordHash,
                        Role.MANAGER,
                        true
                );
                mgr.setCreatedAt(LocalDateTime.now().minusDays(90));
                userRepository.save(mgr);
                log.info("Seeded manager account: {}", email);
            }
        }
    }

    private void seedSampleClaims() {
        if (claimRepository.count() > 0) {
            log.info("Claims already seeded, skipping.");
            return;
        }

        List<User> users = userRepository.findByRoleOrderByCreatedAtDesc(Role.USER);
        List<User> employees = userRepository.findByRoleOrderByCreatedAtDesc(Role.EMPLOYEE);
        if (users.isEmpty() || employees.isEmpty()) {
            return;
        }

        // We will seed 16 realistic claims covering all roles, types and statuses
        Object[][] claimSpecs = {
                // type, dateOffset, location, desc, amount, contact, status, userIdx, empIdx
                {
                        ClaimType.MOTOR, 2, "Marina Bay, Singapore",
                        "Rear-end bumper collision at traffic signal on Marina Blvd. Rear sensor and tailgate dented.",
                        new BigDecimal("3450.00"), "+65 9123 4567", ClaimStatus.SUBMITTED, 0, 0
                },
                {
                        ClaimType.PROPERTY, 5, "Orchard Boulevard Condo, Singapore",
                        "Sudden burst concealed water pipe behind master bathroom wall damaging engineered wood flooring.",
                        new BigDecimal("7800.00"), "+65 9234 5678", ClaimStatus.UNDER_REVIEW, 1, 0
                },
                {
                        ClaimType.MOTOR, 8, "George Street, Sydney CBD, Australia",
                        "Sideswipe incident during merging maneuver on Western Distributor. Left panel scraped and mirror broken.",
                        new BigDecimal("2600.00"), "+61 412 345 678", ClaimStatus.INFORMATION_REQUIRED, 2, 1
                },
                {
                        ClaimType.PROPERTY, 12, "Surry Hills Residential Unit, Sydney",
                        "Heavy storm rainfall penetrated rooftop ventilation causing ceiling plasterboard collapse and carpet damage.",
                        new BigDecimal("12400.00"), "+61 423 456 789", ClaimStatus.APPROVED, 3, 1
                },
                {
                        ClaimType.MOTOR, 15, "Nathan Road, Kowloon, Hong Kong",
                        "Parked vehicle hit by commercial delivery van while unattended. Front left fender cracked and headlight smashed.",
                        new BigDecimal("4200.00"), "+852 9123 8899", ClaimStatus.SETTLED, 4, 2
                },
                {
                        ClaimType.PROPERTY, 18, "Central Mid-Levels Apartment, Hong Kong",
                        "Kitchen grease fire partially extinguished by sprinkler, causing smoke damage to walls and water damage to cabinets.",
                        new BigDecimal("15600.00"), "+852 9876 5432", ClaimStatus.REJECTED, 5, 2
                },
                {
                        ClaimType.MOTOR, 3, "Queen Street, Auckland, New Zealand",
                        "Hail damage during sudden severe thunderstorm resulting in multiple dent impressions across hood and roof.",
                        new BigDecimal("5100.00"), "+64 21 123 4567", ClaimStatus.SUBMITTED, 6, 3
                },
                {
                        ClaimType.PROPERTY, 7, "Ponsonby Road Villa, Auckland",
                        "Power surge during electrical grid storm causing irreversible damage to HVAC inverter and home security system.",
                        new BigDecimal("6300.00"), "+64 22 987 6543", ClaimStatus.UNDER_REVIEW, 7, 3
                },
                {
                        ClaimType.MOTOR, 10, "Collins Street, Melbourne, Australia",
                        "Reversing vehicle misjudged distance in underground car park, bending rear bumper bar and shattering tail lamp.",
                        new BigDecimal("1850.00"), "+61 433 111 222", ClaimStatus.APPROVED, 8, 4
                },
                {
                        ClaimType.PROPERTY, 14, "South Yarra Townhouse, Melbourne",
                        "Neighboring property wall water seepage affecting adjoining bedroom drywall and built-in wardrobe.",
                        new BigDecimal("4900.00"), "+61 444 333 222", ClaimStatus.SETTLED, 9, 4
                },
                {
                        ClaimType.MOTOR, 6, "Shibuya Crossing vicinity, Tokyo, Japan",
                        "Stone chip on highway windshield expanded into a large spider crack across driver line of sight.",
                        new BigDecimal("1250.00"), "+81 90 1234 5678", ClaimStatus.APPROVED, 0, 5
                },
                {
                        ClaimType.PROPERTY, 20, "Roppongi Hills Apartment, Tokyo",
                        "Minor seismic tremor caused glass display cabinet fall and damage to imported ceramic collection.",
                        new BigDecimal("8900.00"), "+81 80 9876 5432", ClaimStatus.SETTLED, 1, 5
                },
                {
                        ClaimType.MOTOR, 4, "Brisbane Airport Long Term Car Park",
                        "Vandalism key scratch along passenger side doors and quarter panel while owner was traveling interstate.",
                        new BigDecimal("2100.00"), "+61 455 666 777", ClaimStatus.SUBMITTED, 2, 6
                },
                {
                        ClaimType.PROPERTY, 9, "Teneriffe Woolstore Apartment, Brisbane",
                        "Dishwasher supply hose failure during wash cycle causing flooding across living area and hallway floor.",
                        new BigDecimal("9300.00"), "+61 466 777 888", ClaimStatus.UNDER_REVIEW, 3, 6
                },
                {
                        ClaimType.MOTOR, 22, "St Georges Terrace, Perth, Australia",
                        "Multiple vehicle chain reaction collision on freeway exit ramp; rear and front structural crumple.",
                        new BigDecimal("18200.00"), "+61 477 888 999", ClaimStatus.REJECTED, 4, 7
                },
                {
                        ClaimType.PROPERTY, 16, "Cottesloe Beach Residence, Perth",
                        "High coastal gale winds shattered balcony sliding glass door, causing saltwater ingress to lounge furnishings.",
                        new BigDecimal("11500.00"), "+61 488 999 000", ClaimStatus.SETTLED, 5, 7
                }
        };

        int year = LocalDate.now().getYear();
        for (int i = 0; i < claimSpecs.length; i++) {
            Object[] spec = claimSpecs[i];
            ClaimType type = (ClaimType) spec[0];
            int daysAgo = (Integer) spec[1];
            String location = (String) spec[2];
            String desc = (String) spec[3];
            BigDecimal amount = (BigDecimal) spec[4];
            String contact = (String) spec[5];
            ClaimStatus targetStatus = (ClaimStatus) spec[6];
            int userIdx = ((Integer) spec[7]) % users.size();
            int empIdx = ((Integer) spec[8]) % employees.size();

            User claimant = users.get(userIdx);
            User reviewer = employees.get(empIdx);

            String claimNumber = String.format("CHB-%d-%06d", year, i + 1);

            Claim claim = new Claim();
            claim.setClaimNumber(claimNumber);
            claim.setUser(claimant);
            claim.setClaimType(type);
            claim.setIncidentDate(LocalDate.now().minusDays(daysAgo + 3));
            claim.setIncidentLocation(location);
            claim.setDescription(desc);
            claim.setEstimatedLoss(amount);
            claim.setContactNumber(contact);
            claim.setStatus(targetStatus);
            claim.setCreatedAt(LocalDateTime.now().minusDays(daysAgo));
            claim.setUpdatedAt(LocalDateTime.now().minusDays(Math.max(0, daysAgo - 1)));

            Claim savedClaim = claimRepository.save(claim);

            // History entries
            ClaimHistory h1 = new ClaimHistory(
                    savedClaim,
                    null,
                    ClaimStatus.SUBMITTED,
                    "Claim filed by claimant online via Chubb Portal.",
                    claimant.getFullName() + " (" + claimant.getEmail() + ")"
            );
            h1.setCreatedAt(savedClaim.getCreatedAt());
            claimHistoryRepository.save(h1);

            String empLabel = reviewer.getFullName() + " [EMP ID: #" + reviewer.getId() + "]";

            if (targetStatus == ClaimStatus.UNDER_REVIEW ||
                targetStatus == ClaimStatus.INFORMATION_REQUIRED ||
                targetStatus == ClaimStatus.APPROVED ||
                targetStatus == ClaimStatus.REJECTED ||
                targetStatus == ClaimStatus.SETTLED) {

                ClaimHistory h2 = new ClaimHistory(
                        savedClaim,
                        ClaimStatus.SUBMITTED,
                        ClaimStatus.UNDER_REVIEW,
                        "Assigned to claims assessor for initial incident and policy coverage review.",
                        empLabel
                );
                h2.setCreatedAt(savedClaim.getCreatedAt().plusHours(4));
                claimHistoryRepository.save(h2);
            }

            if (targetStatus == ClaimStatus.INFORMATION_REQUIRED) {
                ClaimHistory h3 = new ClaimHistory(
                        savedClaim,
                        ClaimStatus.UNDER_REVIEW,
                        ClaimStatus.INFORMATION_REQUIRED,
                        "Please provide clear photographs of all impacted panels and repairer quotation estimate.",
                        empLabel
                );
                h3.setCreatedAt(savedClaim.getCreatedAt().plusHours(12));
                claimHistoryRepository.save(h3);
            } else if (targetStatus == ClaimStatus.APPROVED || targetStatus == ClaimStatus.SETTLED) {
                ClaimHistory h3 = new ClaimHistory(
                        savedClaim,
                        ClaimStatus.UNDER_REVIEW,
                        ClaimStatus.APPROVED,
                        "Damage assessment verified. Incident meets policy coverage schedule. Claim approved.",
                        empLabel
                );
                h3.setCreatedAt(savedClaim.getCreatedAt().plusDays(1));
                claimHistoryRepository.save(h3);

                if (targetStatus == ClaimStatus.SETTLED) {
                    ClaimHistory h4 = new ClaimHistory(
                            savedClaim,
                            ClaimStatus.APPROVED,
                            ClaimStatus.SETTLED,
                            "Settlement payment disbursed to claimant account via electronic transfer. Case concluded.",
                            empLabel
                    );
                    h4.setCreatedAt(savedClaim.getCreatedAt().plusDays(2));
                    claimHistoryRepository.save(h4);
                }
            } else if (targetStatus == ClaimStatus.REJECTED) {
                ClaimHistory h3 = new ClaimHistory(
                        savedClaim,
                        ClaimStatus.UNDER_REVIEW,
                        ClaimStatus.REJECTED,
                        "Claim rejected: incident circumstances not covered under current standard policy terms.",
                        empLabel
                );
                h3.setCreatedAt(savedClaim.getCreatedAt().plusDays(1));
                claimHistoryRepository.save(h3);
            }
        }
        log.info("Successfully seeded 16 sample Chubb insurance claims with full audit histories.");
    }
}
