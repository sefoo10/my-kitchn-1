// Firebase Configuration - مظبط بإعداداتك
const firebaseConfig = {
    apiKey: "AIzaSyD639471Xuyi-Mfmedia_r99infc8j1U4LV9UHv",
    authDomain: "my-kitchen-49a81.firebaseapp.com",
    databaseURL: "https://my-kitchen-49a81-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "my-kitchen-49a81",
    storageBucket: "my-kitchen-49a81.appspot.com",
    messagingSenderId: "207795153976",
    appId: "1:207795153976:web:ic7f5e5a1effd913773881"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// الدوال الأساسية
async function saveProduct(product) {
    try {
        const newProductRef = firebase.database().ref('products').push();
        const productId = newProductRef.key;
        await newProductRef.set({
            ...product,
            id: productId
        });
        return productId;
    } catch (error) {
        console.error('Error saving product:', error);
        alert('حدث خطأ في حفظ المنتج');
    }
}

function getProducts(callback) {
    firebase.database().ref('products').on('value', (snapshot) => {
        const productsData = snapshot.val();
        const productsArray = [];
        
        if (productsData) {
            Object.keys(productsData).forEach(key => {
                productsArray.push({
                    ...productsData[key],
                    firebaseId: key
                });
            });
        }
        
        callback(productsArray);
    });
}

async function deleteProduct(productId) {
    try {
        await firebase.database().ref('products/' + productId).remove();
        return true;
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('حدث خطأ في حذف المنتج');
        return false;
    }
}

async function updateProduct(productId, updates) {
    try {
        await firebase.database().ref('products/' + productId).update(updates);
        return true;
    } catch (error) {
        console.error('Error updating product:', error);
        alert('حدث خطأ في تحديث المنتج');
        return false;
    }
}

// دوال الطلبات
async function saveOrder(order) {
    try {
        const newOrderRef = firebase.database().ref('orders').push();
        const orderId = newOrderRef.key;
        await newOrderRef.set({
            ...order,
            id: orderId
        });
        return orderId;
    } catch (error) {
        console.error('Error saving order:', error);
        alert('حدث خطأ في حفظ الطلب');
    }
}

function getOrders(callback) {
    firebase.database().ref('orders').on('value', (snapshot) => {
        const ordersData = snapshot.val();
        const ordersArray = [];
        
        if (ordersData) {
            Object.keys(ordersData).forEach(key => {
                ordersArray.push({
                    ...ordersData[key],
                    firebaseId: key
                });
            });
        }
        
        callback(ordersArray);
    });
}

async function updateOrder(orderId, updates) {
    try {
        await firebase.database().ref('orders/' + orderId).update(updates);
        return true;
    } catch (error) {
        console.error('Error updating order:', error);
        alert('حدث خطأ في تحديث الطلب');
        return false;
    }
}

async function deleteOrder(orderId) {
    try {
        await firebase.database().ref('orders/' + orderId).remove();
        return true;
    } catch (error) {
        console.error('Error deleting order:', error);
        alert('حدث خطأ في حذف الطلب');
        return false;
    }
}