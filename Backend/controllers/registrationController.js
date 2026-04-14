import mongoose from "mongoose";
import Registration from "../models/Registration.js";
import User from "../models/User.js";
import ClubMembership from "../models/ClubMembership.js";
import Certificate from "../models/Certificate.js";
import { cloudinary } from "../middleware/cloudinaryConfig.js";

export const createRegistration = async (req, res) => {
  console.log("Incoming Registration Request:", {
    body: req.body,
    files: req.files ? Object.keys(req.files) : "no files",
  });
  try {
    const {
      eventId,
      fullName,
      email,
      phone,
      dateOfBirth,
      bloodGroup,
      address,
      city,
      state,
      pincode,
      emergencyContactName,
      emergencyContactPhone,
      bikeModel,
      bikeRegistrationNumber,
      licenseNumber,
      anyMedicalCondition,
      tShirtSize,
      requestRidingGears,
      requestedGears,
    } = req.body;

    // Check if user already has images in their profile
    const existingUser = await User.findOne({
      $or: [{ email: email?.toLowerCase() }, { phone: phone }],
    });

    // License image is only required for event registrations, not community registrations
    if (eventId !== "community") {
      const hasUploadedLicense = req.files && req.files.licenseImage;
      const hasExistingLicense = existingUser && existingUser.licenseImage;

      if (!hasUploadedLicense && !hasExistingLicense) {
        return res
          .status(400)
          .json({ message: "Driving license image is mandatory" });
      }
    }

    // Profile image is mandatory for event registrations
    if (eventId !== "community") {
      const hasUploadedProfile = req.files && req.files.profileImage;
      const hasExistingProfile = existingUser && existingUser.profileImage;

      if (!hasUploadedProfile && !hasExistingProfile) {
        return res
          .status(400)
          .json({ message: "Profile picture is mandatory" });
      }
    }

    // Check age (18+) - only for event registrations
    if (eventId !== "community" && dateOfBirth) {
      const dob = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      if (age < 18) {
        return res
          .status(400)
          .json({ message: "You must be at least 18 years old to register" });
      }
    }

    // Phone validation (exactly 10 digits)
    if (phone && !/^\d{10}$/.test(phone)) {
      return res
        .status(400)
        .json({ message: "Phone number must be exactly 10 digits" });
    }

    // Emergency contact phone validation (only for event registrations)
    if (
      eventId !== "community" &&
      emergencyContactPhone &&
      !/^\d{10}$/.test(emergencyContactPhone)
    ) {
      return res
        .status(400)
        .json({
          message: "Emergency contact phone number must be exactly 10 digits",
        });
    }

    // Check for duplicates within the same event
    const duplicate = await Registration.findOne({
      eventId,
      $or: [
        { email },
        { phone },
        { bikeRegistrationNumber },
        { licenseNumber },
      ],
    });

    if (duplicate) {
      let field = "";
      if (duplicate.email === email) field = "Email";
      else if (duplicate.phone === phone) field = "Phone number";
      else if (duplicate.bikeRegistrationNumber === bikeRegistrationNumber)
        field = "Bike registration number";
      else if (duplicate.licenseNumber === licenseNumber)
        field = "License number";

      return res
        .status(400)
        .json({ message: `${field} is already registered` });
    }

    const registrationData = {
      eventId,
      fullName,
      email,
      phone,
      licenseImage: "",
      licenseImagePublicId: "",
      profileImage: "",
      profileImagePublicId: "",
    };

    // For event registrations, include all fields
    if (eventId !== "community") {
      registrationData.dateOfBirth = dateOfBirth;
      registrationData.bloodGroup = bloodGroup;
      registrationData.address = address;
      registrationData.city = city;
      registrationData.state = state;
      registrationData.pincode = pincode;
      registrationData.emergencyContactName = emergencyContactName;
      registrationData.emergencyContactPhone = emergencyContactPhone;
      registrationData.bikeModel = bikeModel;
      registrationData.bikeRegistrationNumber = bikeRegistrationNumber;
      registrationData.licenseNumber = licenseNumber;
      registrationData.anyMedicalCondition = anyMedicalCondition;
      registrationData.tShirtSize = tShirtSize;

      if (req.files && req.files.licenseImage) {
        registrationData.licenseImage = req.files.licenseImage[0].path;
        registrationData.licenseImagePublicId =
          req.files.licenseImage[0].filename;
      } else if (existingUser && existingUser.licenseImage) {
        registrationData.licenseImage = existingUser.licenseImage;
        registrationData.licenseImagePublicId =
          existingUser.licenseImagePublicId;
      }

      if (req.files && req.files.profileImage) {
        registrationData.profileImage = req.files.profileImage[0].path;
        registrationData.profileImagePublicId =
          req.files.profileImage[0].filename;
      } else if (existingUser && existingUser.profileImage) {
        registrationData.profileImage = existingUser.profileImage;
        registrationData.profileImagePublicId =
          existingUser.profileImagePublicId;
      }

      // Only add riding gears for event registrations
      if (requestRidingGears === "true" || requestRidingGears === true) {
        registrationData.requestRidingGears = true;
        if (requestedGears) {
          try {
            registrationData.requestedGears =
              typeof requestedGears === "string"
                ? JSON.parse(requestedGears)
                : requestedGears;
            console.log("Riding gears saved:", registrationData.requestedGears);
          } catch (e) {
            console.error("Error parsing riding gears:", e);
            registrationData.requestedGears = {};
          }
        } else {
          registrationData.requestedGears = {};
        }
      } else {
        registrationData.requestRidingGears = false;
        registrationData.requestedGears = {};
      }
    }

    const registration = new Registration(registrationData);

    const newRegistration = await registration.save();
    console.log("Registration saved successfully:", {
      id: newRegistration._id,
      eventId: newRegistration.eventId,
      requestRidingGears: newRegistration.requestRidingGears,
      requestedGears: newRegistration.requestedGears,
    });

    // Create or update a certificate record for event registrations
    if (eventId !== "community" && existingUser) {
      try {
        // Find active club membership, if any
        const activeMembership = await ClubMembership.findOne({
          userId: existingUser._id,
          status: "active",
        }).select("clubId");

        await Certificate.findOneAndUpdate(
          { userId: existingUser._id, eventId: newRegistration.eventId },
          {
            userId: existingUser._id,
            eventId: newRegistration.eventId,
            clubId: activeMembership ? activeMembership.clubId : null,
            participantName: fullName || existingUser.fullName || email,
            status: "ready",
            generatedAt: new Date(),
          },
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
      } catch (certErr) {
        console.error("Certificate upsert error (non-fatal):", certErr.message);
      }
    }

    res.status(201).json(newRegistration);
  } catch (error) {
    console.error("Registration Error:", error);

    // Handle Mongoose duplicate key error (E11000)
    if (error.code === 11000) {
      const keyPattern = error.keyPattern || {};
      let field =
        Object.keys(keyPattern).find((k) => k !== "eventId") ||
        Object.keys(keyPattern)[0];

      // Map field names to user-friendly labels
      const fieldLabels = {
        email: "Email",
        phone: "Phone number",
        bikeRegistrationNumber: "Bike registration number",
        licenseNumber: "License number",
      };

      const label =
        fieldLabels[field] || field.charAt(0).toUpperCase() + field.slice(1);
      return res.status(400).json({
        message: `${label} is already registered for this particular event.`,
      });
    }

    res.status(400).json({ message: error.message });
  }
};

export const getRegistrations = async (req, res) => {
  try {
    const { eventId, email, phone } = req.query;
    let filter = {};

    if (eventId && eventId !== "all") {
      if (eventId === "community") {
        filter.eventId = "community";
      } else {
        filter.$or = [
          { eventId: eventId },
          { eventId: mongoose.Types.ObjectId.createFromHexString(eventId) },
        ];
      }
    }

    if (email) {
      filter.email = email.toLowerCase();
    }

    if (phone) {
      filter.phone = phone;
    }

    let registrations = await Registration.find(filter)
      .populate("eventId", "title eventDate")
      .sort({ registeredAt: -1 });

    // Filter out registrations where the event no longer exists (except for community registrations)
    registrations = registrations.filter((reg) => {
      // If it's a community registration, keep it
      if (reg.eventId === "community") return true;
      // If it's an event registration, keep it only if the populated eventId exists
      return reg.eventId !== null && reg.eventId !== undefined;
    });

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);
    if (!registration) {
      return res.status(404).json({ message: "Registration not found" });
    }

    // Delete image from cloudinary
    if (registration.licenseImagePublicId) {
      await cloudinary.uploader.destroy(registration.licenseImagePublicId);
    }

    await Registration.findByIdAndDelete(req.params.id);
    res.json({ message: "Registration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
