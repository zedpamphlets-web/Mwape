import * as InAppPurchases from 'react-native-iap';

const SKUs = {
  ios: ['com.signspeak.premium_monthly', 'com.signspeak.premium_yearly'],
  android: ['premium_monthly', 'premium_yearly'],
};

export const initializePurchases = async () => {
  try {
    await InAppPurchases.initConnection();
    const products = await InAppPurchases.getProducts(SKUs.ios);
    return products;
  } catch (error) {
    console.error('Error initializing purchases:', error);
    throw error;
  }
};

export const purchaseProduct = async (productId) => {
  try {
    await InAppPurchases.requestPurchase(productId);
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
};

export const restorePurchases = async () => {
  try {
    await InAppPurchases.consumeAllItems();
    const purchases = await InAppPurchases.getAvailablePurchases();
    return purchases;
  } catch (error) {
    console.error('Error restoring purchases:', error);
    throw error;
  }
};
