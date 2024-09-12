import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', description: '' });
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  // Fetch all menu items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/menuItems');
      setMenuItems(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Create a new menu item
  const createMenuItem = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/menuItems', newMenuItem);
      setMenuItems([...menuItems, response.data]);
      setNewMenuItem({ name: '', price: '', description: '' });
    } catch (err) {
      console.error(err);
    }
  };

  // Update an existing menu item
  const updateMenuItem = async (id) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/menuItems/${id}`, editingMenuItem);
      setMenuItems(menuItems.map(item => (item._id === id ? response.data : item)));
      setEditingMenuItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a menu item
  const deleteMenuItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menuItems/${id}`);
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Menu</h1>

      {/* Create new menu item */}
      <div>
        <h2>Add New Menu Item</h2>
        <input
          type="text"
          placeholder="Name"
          value={newMenuItem.name}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price"
          value={newMenuItem.price}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newMenuItem.description}
          onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
        />
        <button onClick={createMenuItem}>Add</button>
      </div>

      {/* List all menu items */}
      <ul>
        {menuItems.map((item) => (
          <li key={item._id}>
            {editingMenuItem && editingMenuItem._id === item._id ? (
              <div>
                <input
                  type="text"
                  value={editingMenuItem.name}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                />
                <input
                  type="number"
                  value={editingMenuItem.price}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: e.target.value })}
                />
                <input
                  type="text"
                  value={editingMenuItem.description}
                  onChange={(e) => setEditingMenuItem({ ...editingMenuItem, description: e.target.value })}
                />
                <button onClick={() => updateMenuItem(item._id)}>Save</button>
                <button onClick={() => setEditingMenuItem(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                {item.name} - {item.price} THB - {item.description}
                <button onClick={() => setEditingMenuItem(item)}>Edit</button>
                <button onClick={() => deleteMenuItem(item._id)}>Delete</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
