const Company = require("../model/companyModel");
const User = require("../model/userModel");
const bcrypt = require("bcrypt");

const Signup = async (req, res) => {
    const {
        name, email, password, phone,
        companyName, companyType, registrationNumber,
        address, city, state, pincode, website, establishedDate
    } = req.body;

    let user;

    try {
        if (
            !name || !email || !password || !phone ||
            !companyName || !companyType || !registrationNumber ||
            !address || !city || !state || !pincode ||
            !establishedDate
        ) {
            return res.status(400).json({
                message: "All required fields are required"
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);

        user = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashPassword,
            phoneNumber: phone,
            role: "company"
        });

        const company = await Company.create({
            companyName,
            companyType,
            registrationNumber,
            owner: name,
            industry: companyType,
            mailingAddress: {
                streetAddress: address,
                city,
                state,
                zipCode: pincode,
                country: "India"
            },
            website,
            establishedDate,
            user: user._id
        });

        return res.status(201).json({
            message: "Company registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            company
        });

    } catch (error) {
        if (user) {
            await User.findByIdAndDelete(user._id);
        }

        console.log(error.message);

        return res.status(500).json({
            message: "Company registration failed"
        });
    }
};



const createCompany = async (req, res) => {
    try {
        const {
            companyName,
            companyType,
            registrationNumber,
            owner,
            mailingAddress,
            nominalCapital,
            industry,
            website,
            establishedDate,
            user
        } = req.body;

        if (
            !companyName || !companyType || !registrationNumber ||
            !owner || !mailingAddress || !industry ||
            !establishedDate || !user
        ) {
            return res.status(400).json({
                message: "All required fields are required"
            });
        }

        const company = await Company.create({
            companyName,
            companyType,
            registrationNumber,
            owner,
            mailingAddress,
            nominalCapital,
            industry,
            website,
            establishedDate,
            user
        });

        res.status(201).json({
            message: "Company registered successfully",
            company
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};



const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();

        res.status(200).json({
            message: "Companies fetched successfully",
            companies
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json(company);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const updateCompany = async (req, res) => {
    try {
        const {
            companyName,
            companyType,
            registrationNumber,
            owner,
            industry,
            mailingAddress,
            website,
            establishedDate
        } = req.body;

        const updateData = {};

        if (companyName !== undefined) updateData.companyName = companyName;
        if (companyType !== undefined) updateData.companyType = companyType;
        if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber;
        if (owner !== undefined) updateData.owner = owner;
        if (industry !== undefined) updateData.industry = industry;
        if (mailingAddress !== undefined) updateData.mailingAddress = mailingAddress;
        if (website !== undefined) updateData.website = website;
        if (establishedDate !== undefined) updateData.establishedDate = establishedDate;

        const company = await Company.findByIdAndUpdate(
            req.params.id,
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json({
            message: "Company updated successfully",
            company
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const deleteCompany = async (req, res) => {
    try {
        const company = await Company.findByIdAndDelete(req.params.id);

        if (!company) {
            return res.status(404).json({
                message: "Company not found"
            });
        }

        res.status(200).json({
            message: "Company deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


const editProfile = async (req, res) => {
    try {
        const {
            companyName,
            companyType,
            industry,
            mailingAddress,
            website,
            establishedDate
        } = req.body;

        const updateData = {};

        if (companyName !== undefined) updateData.companyName = companyName;
        if (companyType !== undefined) updateData.companyType = companyType;
        if (industry !== undefined) updateData.industry = industry;
        if (mailingAddress !== undefined) updateData.mailingAddress = mailingAddress;
        if (website !== undefined) updateData.website = website;
        if (establishedDate !== undefined) updateData.establishedDate = establishedDate;

        const company = await Company.findOneAndUpdate(
            { user: req.user._id },
            { $set: updateData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!company) {
            return res.status(404).json({
                message: "Company profile not found"
            });
        }

        res.status(200).json({
            message: "Company profile updated successfully",
            company
        });

    } catch (error) {
        res.status(500).json({
            message: "Error updating company profile",
            error: error.message
        });
    }
};


module.exports = { createCompany, getCompanies, getCompanyById, updateCompany, deleteCompany, Signup, editProfile };
