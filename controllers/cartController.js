import userModel from '../models/userModel.js'
//add products to user Cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Find the user by ID
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData is an object (use an empty object if it doesn't exist)
    let cartData = userData.cartData || {};

    // Update the cart data
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1; // Increment the quantity of this item size
      } else {
        cartData[itemId][size] = 1; // If size doesn't exist, initialize it with quantity 1
      }
    } else {
      // If item doesn't exist, add it to cartData
      cartData[itemId] = {};
      cartData[itemId][size] = 1; // Initialize size with quantity 1
    }

    // Use findByIdAndUpdate to update the cartData field in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Error updating user" });
    }

    // Success response
    res.json({
      success: true,
      message: "Added to Cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to add item to cart" });
  }
};
//update user Cart
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: " Cart update" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
//get user Cart
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Delete product from user Cart
const deleteFromCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    // Find the user by ID
    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    // Ensure cartData is an object (use an empty object if it doesn't exist)
    let cartData = userData.cartData || {};

    // Check if item exists in cartData
    if (cartData[itemId]) {
      if (size && cartData[itemId][size] !== undefined) {
        // Delete the specific size if it exists
        delete cartData[itemId][size];

        // If no sizes remain for this item, remove the item itself
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else if (!size) {
        // If no size is specified, delete the entire item
        delete cartData[itemId];
      }
    } else {
      return res.json({ success: false, message: "Item not found in cart" });
    }

    // Update the user's cart data in the database
    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { cartData },
      { new: true } // This ensures that the updated document is returned
    );

    if (!updatedUser) {
      return res.json({ success: false, message: "Error updating user cart" });
    }

    // Success response
    res.json({
      success: true,
      message: "Item deleted from cart",
      cartData: updatedUser.cartData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Failed to delete item from cart" });
  }
};


export { addToCart, updateCart, getUserCart, deleteFromCart };
