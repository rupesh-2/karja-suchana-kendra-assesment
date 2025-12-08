const { SystemSetting, User } = require('../../models');
const LogService = require('../../services/logService');

const getAllSettings = async (req, res) => {
  try {
    const settings = await SystemSetting.findAll({
      order: [['key', 'ASC']]
    });
    
    // Convert to key-value object for easier frontend consumption
    const settingsObj = {};
    settings.forEach(setting => {
      let value = setting.value;
      
      // Parse based on type
      if (setting.type === 'boolean') {
        value = value === 'true' || value === true;
      } else if (setting.type === 'number') {
        value = parseFloat(value);
      } else if (setting.type === 'json') {
        try {
          value = JSON.parse(value);
        } catch (e) {
          value = value;
        }
      }
      
      settingsObj[setting.key] = {
        value,
        type: setting.type,
        description: setting.description,
        updated_at: setting.updated_at
      };
    });
    
    res.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

const getSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const setting = await SystemSetting.findOne({ where: { key } });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    let value = setting.value;
    if (setting.type === 'boolean') {
      value = value === 'true' || value === true;
    } else if (setting.type === 'number') {
      value = parseFloat(value);
    } else if (setting.type === 'json') {
      try {
        value = JSON.parse(value);
      } catch (e) {
        value = value;
      }
    }
    
    res.json({ key: setting.key, value, type: setting.type, description: setting.description });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

const updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    if (value === undefined) {
      return res.status(400).json({ error: 'Value is required' });
    }
    
    const setting = await SystemSetting.findOne({ where: { key } });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    // Convert value to string based on type
    let stringValue = value;
    if (setting.type === 'boolean') {
      stringValue = String(Boolean(value));
    } else if (setting.type === 'number') {
      stringValue = String(Number(value));
    } else if (setting.type === 'json') {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }
    
    await setting.update({
      value: stringValue,
      updated_by: req.user.id
    });
    
    await LogService.createLog(
      req.user.id,
      'System Setting Updated',
      req.user.id,
      req.ip,
      req.get('user-agent'),
      `Updated setting: ${key} = ${stringValue}`
    );
    
    res.json({ message: 'Setting updated successfully', setting: { key, value, type: setting.type } });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

const updateMultipleSettings = async (req, res) => {
  try {
    const { settings } = req.body; // { key1: value1, key2: value2, ... }
    
    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }
    
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      const setting = await SystemSetting.findOne({ where: { key } });
      
      if (setting) {
        let stringValue = value;
        if (setting.type === 'boolean') {
          stringValue = String(Boolean(value));
        } else if (setting.type === 'number') {
          stringValue = String(Number(value));
        } else if (setting.type === 'json') {
          stringValue = JSON.stringify(value);
        } else {
          stringValue = String(value);
        }
        
        await setting.update({
          value: stringValue,
          updated_by: req.user.id
        });
        
        updates.push(key);
      }
    }
    
    await LogService.createLog(
      req.user.id,
      'System Settings Updated',
      req.user.id,
      req.ip,
      req.get('user-agent'),
      `Updated settings: ${updates.join(', ')}`
    );
    
    res.json({ message: 'Settings updated successfully', updated: updates });
  } catch (error) {
    console.error('Update multiple settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
};

module.exports = {
  getAllSettings,
  getSetting,
  updateSetting,
  updateMultipleSettings
};

