package com.movemate.relocation.service;

import com.movemate.location.entity.Location;
import com.movemate.location.repository.LocationRepository;
import com.movemate.relocation.dto.CreateRelocationRequest;
import com.movemate.relocation.dto.RelocationRequestDto;
import com.movemate.relocation.dto.UpdateRelocationRequest;
import com.movemate.relocation.entity.RelocationRequest;
import com.movemate.relocation.entity.RelocationStatus;
import com.movemate.relocation.repository.RelocationRequestRepository;
import com.movemate.user.entity.User;
import com.movemate.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class RelocationService {

    private final RelocationRequestRepository relocationRequestRepository;
    private final UserRepository userRepository;
    private final LocationRepository locationRepository;

    public RelocationService(RelocationRequestRepository relocationRequestRepository,
                             UserRepository userRepository,
                             LocationRepository locationRepository) {
        this.relocationRequestRepository = relocationRequestRepository;
        this.userRepository = userRepository;
        this.locationRepository = locationRepository;
    }

    @Transactional
    public RelocationRequestDto createRelocationRequest(String email, CreateRelocationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Location originLoc = locationRepository.findById(request.getOriginLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid origin location ID"));

        Location destLoc = locationRepository.findById(request.getDestinationLocationId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid destination location ID"));

        RelocationRequest relocation = new RelocationRequest(user, originLoc, destLoc, request.getPurpose(), request.getMovingDate());
        relocation.setDestinationArea(request.getDestinationArea());
        relocation.setProfession(request.getProfession());
        relocation.setBudget(request.getBudget());
        relocation.setRequirements(request.getRequirements());
        relocation.setStatus(RelocationStatus.ACTIVE);

        RelocationRequest saved = relocationRequestRepository.save(relocation);
        return new RelocationRequestDto(saved);
    }

    @Transactional(readOnly = true)
    public List<RelocationRequestDto> getRelocationRequestsByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        List<RelocationRequest> requests = relocationRequestRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        return requests.stream().map(RelocationRequestDto::new).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public RelocationRequestDto getRelocationRequestById(Long id) {
        RelocationRequest relocation = relocationRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Relocation request not found"));
        return new RelocationRequestDto(relocation);
    }

    @Transactional
    public RelocationRequestDto updateRelocationRequest(String email, Long id, UpdateRelocationRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        RelocationRequest relocation = relocationRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Relocation request not found"));

        // MANDATORY OWNERSHIP AUTHORIZATION CHECK
        if (!relocation.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to modify this relocation request");
        }

        if (request.getOriginLocationId() != null) {
            Location originLoc = locationRepository.findById(request.getOriginLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid origin location ID"));
            relocation.setOriginLocation(originLoc);
        }

        if (request.getDestinationLocationId() != null) {
            Location destLoc = locationRepository.findById(request.getDestinationLocationId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid destination location ID"));
            relocation.setDestinationLocation(destLoc);
        }

        if (request.getDestinationArea() != null) {
            relocation.setDestinationArea(request.getDestinationArea());
        }

        if (request.getPurpose() != null) {
            relocation.setPurpose(request.getPurpose());
        }

        if (request.getProfession() != null) {
            relocation.setProfession(request.getProfession());
        }

        if (request.getBudget() != null) {
            relocation.setBudget(request.getBudget());
        }

        if (request.getMovingDate() != null) {
            relocation.setMovingDate(request.getMovingDate());
        }

        if (request.getRequirements() != null) {
            relocation.setRequirements(request.getRequirements());
        }

        if (request.getStatus() != null) {
            relocation.setStatus(request.getStatus());
        }

        RelocationRequest updated = relocationRequestRepository.save(relocation);
        return new RelocationRequestDto(updated);
    }

    @Transactional
    public RelocationRequestDto cancelRelocationRequest(String email, Long id) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        RelocationRequest relocation = relocationRequestRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Relocation request not found"));

        // MANDATORY OWNERSHIP AUTHORIZATION CHECK
        if (!relocation.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to cancel this relocation request");
        }

        relocation.setStatus(RelocationStatus.CANCELLED);
        RelocationRequest cancelled = relocationRequestRepository.save(relocation);
        return new RelocationRequestDto(cancelled);
    }
}
