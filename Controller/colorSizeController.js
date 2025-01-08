const {Color} = require('../models');
const {Size} = require('../models');

// Color Controllers
exports.getAllColors = async (req, res) => {
    try {
        const colors = await Color.find();
        res.status(200).json(colors);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching colors', error });
    }
};

exports.addColor = async (req, res) => {
    try {
        const { name, hexCode } = req.body;
        const color = new Color({ name, hexCode });
        await color.save();
        res.status(201).json(color);
    } catch (error) {
        res.status(500).json({ message: 'Error adding color', error });
    }
};

exports.updateColor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedColor = await Color.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedColor);
    } catch (error) {
        res.status(500).json({ message: 'Error updating color', error });
    }
};

exports.deleteColor = async (req, res) => {
    try {
        const { id } = req.params;
        await Color.findByIdAndDelete(id);
        res.status(200).json({ message: 'Color deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting color', error });
    }
};

// Size Controllers
exports.getAllSizes = async (req, res) => {
    try {
        const sizes = await Size.find();
        res.status(200).json(sizes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching sizes', error });
    }
};

exports.addSize = async (req, res) => {
    try {
        const { name, description } = req.body;
        const size = new Size({ name, description });
        await size.save();
        res.status(201).json(size);
    } catch (error) {
        res.status(500).json({ message: 'Error adding size', error });
    }
};

exports.updateSize = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedSize = await Size.findByIdAndUpdate(id, req.body, { new: true });
        res.status(200).json(updatedSize);
    } catch (error) {
        res.status(500).json({ message: 'Error updating size', error });
    }
};

exports.deleteSize = async (req, res) => {
    try {
        const { id } = req.params;
        await Size.findByIdAndDelete(id);
        res.status(200).json({ message: 'Size deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting size', error });
    }
};
