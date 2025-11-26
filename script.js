// دالة تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة العرض حسب الصفحة
    if (window.location.pathname.includes('admin.html')) {
        // واجهة البائع
        setupAdminEventListeners();
        loadAdminData();
    } else if (window.location.pathname.includes('products.html')) {
        // واجهة المشتري
        loadCustomerProducts();
    } else if (window.location.pathname.includes('index.html')) {
        // الصفحة الرئيسية
        loadFeaturedProducts();
    }
});

// إعداد event listeners للبائع
function setupAdminEventListeners() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addNewProduct();
        });
    }
}

// تحميل بيانات البائع
function loadAdminData() {
    getProducts(function(products) {
        displayAdminStats(products);
        displayProductsForAdmin(products);
    });
    
    getOrders(function(orders) {
        displayAdminStats(null, orders);
        displayOrdersForAdmin(orders);
    });
}

// تحميل منتجات المشتري
function loadCustomerProducts() {
    getProducts(function(products) {
        displayProductsForCustomer(products);
    });
}

// تحميل المنتجات المميزة
function loadFeaturedProducts() {
    getProducts(function(products) {
        const featuredProducts = products.filter(product => product.available).slice(0, 3);
        displayFeaturedProducts(featuredProducts);
    });
}

// إضافة منتج جديد
function addNewProduct() {
    const name = document.getElementById('productName').value;
    const description = document.getElementById('productDesc').value;
    const price = parseFloat(document.getElementById('productPrice').value);
    
    if (!name || !description || !price) {
        alert('⚠️ الرجاء ملء جميع الحقول');
        return;
    }
    
    const product = {
        name: name,
        description: description,
        price: price,
        image: '🍲',
        available: true,
        createdAt: new Date().toISOString()
    };
    
    saveProduct(product);
    document.getElementById('addProductForm').reset();
    alert('✅ تم إضافة المنتج بنجاح!');
}

// عرض إحصائيات البائع
function displayAdminStats(products = null, orders = null) {
    const productsCount = document.getElementById('productsCount');
    const ordersCount = document.getElementById('ordersCount');
    
    if (productsCount && products) productsCount.textContent = products.length;
    if (ordersCount && orders) ordersCount.textContent = orders.length;
}

// عرض المنتجات في واجهة البائع
function displayProductsForAdmin(products) {
    const adminProductsList = document.getElementById('adminProductsList');
    if (!adminProductsList) return;
    
    adminProductsList.innerHTML = '';
    
    if (products.length === 0) {
        adminProductsList.innerHTML = '<p style="text-align:center; padding:2rem;">لا توجد منتجات حتى الآن</p>';
        return;
    }
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card admin-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price} جنية/كيلو</div>
                <div class="admin-controls-buttons">
                    <button onclick="toggleProductAvailability('${product.firebaseId}', ${!product.available})" class="btn ${product.available ? 'btn-danger' : 'btn-success'}">
                        ${product.available ? 'إخفاء' : 'إظهار'}
                    </button>
                    <button onclick="deleteProduct('${product.firebaseId}')" class="btn btn-danger">حذف</button>
                </div>
            </div>
        `;
        adminProductsList.appendChild(productCard);
    });
}

// عرض المنتجات في واجهة المشتري
function displayProductsForCustomer(products) {
    const productsList = document.getElementById('productsList');
    if (!productsList) return;
    
    productsList.innerHTML = '';
    
    const availableProducts = products.filter(product => product.available);
    
    if (availableProducts.length === 0) {
        productsList.innerHTML = '<p style="text-align:center; padding:2rem;">لا توجد منتجات متاحة حالياً</p>';
        return;
    }
    
    availableProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card customer-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price} جنية/كيلو</div>
                <div class="order-controls">
                    <input type="number" id="qty-${product.firebaseId}" min="0.1" max="10" step="0.1" value="1" placeholder="الكمية">
                    <button onclick="addToCart('${product.firebaseId}')" class="btn">اطلب الآن</button>
                </div>
            </div>
        `;
        productsList.appendChild(productCard);
    });
}

// عرض المنتجات المميزة في الصفحة الرئيسية
function displayFeaturedProducts(featuredProducts) {
    const featuredProductsContainer = document.getElementById('featuredProducts');
    if (!featuredProductsContainer) return;
    
    featuredProductsContainer.innerHTML = '';
    
    if (featuredProducts.length === 0) {
        featuredProductsContainer.innerHTML = '<p style="text-align:center; padding:2rem;">سيظهر هنا أشهر الأطباق</p>';
        return;
    }
    
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card customer-card';
        productCard.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="price">${product.price} جنية/كيلو</div>
                <a href="products.html" class="btn" style="display:block; text-align:center;">اطلب الآن</a>
            </div>
        `;
        featuredProductsContainer.appendChild(productCard);
    });
}

// عرض الطلبات للبائع
function displayOrdersForAdmin(orders) {
    const ordersList = document.getElementById('ordersList');
    if (!ordersList) return;
    
    ordersList.innerHTML = '';
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p style="text-align:center; padding:2rem;">لا توجد طلبات حتى الآن</p>';
        return;
    }
    
    orders.forEach(order => {
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <h4>طلب #${order.id}</h4>
            <p><strong>المنتج:</strong> ${order.productName}</p>
            <p><strong>الكمية:</strong> ${order.quantity} كيلو</p>
            <p><strong>السعر الإجمالي:</strong> ${order.totalPrice} جنية</p>
            <p><strong>حالة الطلب:</strong> 
                <span style="color:${order.status === 'مكتمل' ? '#2ecc71' : '#e74c3c'}">
                    ${order.status}
                </span>
            </p>
            <small>${new Date(order.date).toLocaleString('ar-EG')}</small>
            <div class="admin-controls-buttons" style="margin-top:1rem;">
                <button onclick="completeOrder('${order.firebaseId}')" class="btn btn-success">تم التنفيذ</button>
                <button onclick="deleteOrder('${order.firebaseId}')" class="btn btn-danger">حذف الطلب</button>
            </div>
        `;
        ordersList.appendChild(orderCard);
    });
}

// تبديل حالة المنتج (متاح/غير متاح)
async function toggleProductAvailability(productId, newStatus) {
    const success = await updateProduct(productId, { available: newStatus });
    if (success) {
        alert(`✅ تم ${newStatus ? 'إظهار' : 'إخفاء'} المنتج`);
    }
}

// إضافة طلب جديد
async function addToCart(productId) {
    getProducts(function(products) {
        const product = products.find(p => p.firebaseId === productId && p.available);
        const quantityInput = document.getElementById(`qty-${productId}`);
        const quantity = parseFloat(quantityInput.value);
        
        if (!product) {
            alert('⚠️ المنتج غير متاح حالياً');
            return;
        }
        
        if (!quantity || quantity <= 0) {
            alert('⚠️ الرجاء إدخال كمية صحيحة');
            return;
        }
        
        const order = {
            productId: productId,
            productName: product.name,
            quantity: quantity,
            unitPrice: product.price,
            totalPrice: product.price * quantity,
            status: 'قيد الانتظار',
            date: new Date().toISOString()
        };
        
        saveOrder(order);
        alert(`✅ تم إضافة الطلب: ${quantity} كيلو من ${product.name}`);
        quantityInput.value = 1;
    });
}

// إكمال الطلب
async function completeOrder(orderId) {
    const success = await updateOrder(orderId, { status: 'مكتمل' });
    if (success) {
        alert('✅ تم تحديث حالة الطلب');
    }
}