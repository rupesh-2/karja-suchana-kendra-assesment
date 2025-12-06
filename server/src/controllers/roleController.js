const Role = require('../models/Role');

const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll();
    res.json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ error: 'Failed to fetch roles' });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById(id);
    
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    res.json(role);
  } catch (error) {
    console.error('Get role error:', error);
    res.status(500).json({ error: 'Failed to fetch role' });
  }
};

const createRole = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Role name is required' });
    }

    const existingRole = await Role.findByName(name);
    if (existingRole) {
      return res.status(400).json({ error: 'Role already exists' });
    }

    const role = await Role.create({ name, description });
    res.status(201).json(role);
  } catch (error) {
    console.error('Create role error:', error);
    res.status(500).json({ error: 'Failed to create role' });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    // Check if name is being changed and if it's already taken
    if (name && name !== role.name) {
      const existingRole = await Role.findByName(name);
      if (existingRole) {
        return res.status(400).json({ error: 'Role name already exists' });
      }
    }

    const updatedRole = await Role.update(id, { name, description });
    res.json(updatedRole);
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ error: 'Failed to update role' });
  }
};

const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting default roles
    if ([1, 2, 3].includes(parseInt(id))) {
      return res.status(400).json({ error: 'Cannot delete default roles' });
    }

    const role = await Role.findById(id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    await Role.delete(id);
    res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('Delete role error:', error);
    res.status(500).json({ error: 'Failed to delete role' });
  }
};

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole
};

