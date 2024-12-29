const {MainCategory} = require('../models');
const {Subcategory} = require('../models');

// Main Category CRUD operations

// Create a Main Category
exports.createMainCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const mainCategory = new MainCategory({ name });
        await mainCategory.save();
        res.status(201).json({ message: 'Main Category created successfully', mainCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Main Categories
exports.getAllMainCategories = async (req, res) => {
    try {
        const mainCategories = await MainCategory.find();
        res.status(200).json(mainCategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Main Category by ID
exports.updateMainCategory = async (req, res) => {
    try {
        const mainCategory = await MainCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!mainCategory) return res.status(404).json({ message: 'Main Category not found' });
        res.status(200).json({ message: 'Main Category updated successfully', mainCategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Main Category by ID
exports.deleteMainCategory = async (req, res) => {
    try {
        const mainCategory = await MainCategory.findByIdAndDelete(req.params.id);
        if (!mainCategory) return res.status(404).json({ message: 'Main Category not found' });
        res.status(200).json({ message: 'Main Category deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Subcategory CRUD operations

// Create a Subcategory
exports.createSubcategory = async (req, res) => {
    try {
        const { main_category, name } = req.body;
        const mainCategory = await MainCategory.findById(main_category);
        if (!mainCategory) return res.status(404).json({ message: 'Main Category not found' });

        const subcategory = new Subcategory({ main_category, name });
        await subcategory.save();
        res.status(201).json({ message: 'Subcategory created successfully', subcategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get All Subcategories
exports.getAllSubcategories = async (req, res) => {
    try {
        const subcategories = await Subcategory.find().populate('main_category');
        res.status(200).json(subcategories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Update Subcategory by ID
exports.updateSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory updated successfully', subcategory });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete Subcategory by ID
exports.deleteSubcategory = async (req, res) => {
    try {
        const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
        if (!subcategory) return res.status(404).json({ message: 'Subcategory not found' });
        res.status(200).json({ message: 'Subcategory deleted successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
