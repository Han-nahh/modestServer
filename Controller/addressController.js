const {Address} = require('../models');

// Create an Address
exports.createAddress = async (req, res) => {
    try {
        const { user, address_line1, address_line2, city, state, country, postal_code } = req.body;
        
        const address = new Address({
            user, 
            address_line1, 
            address_line2, 
            city, 
            state, 
            country, 
            postal_code
        });

        await address.save();
        res.status(201).json({ message: 'Address created successfully', address });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Addresses
exports.getAllAddresses = async (req, res) => {
    try {
        const addresses = await Address.find().populate('user');
        res.status(200).json(addresses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get Address by ID
exports.getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id).populate('user');
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Address by ID
exports.updateAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address updated successfully', address });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Address by ID
exports.deleteAddress = async (req, res) => {
    try {
        const address = await Address.findByIdAndDelete(req.params.id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
