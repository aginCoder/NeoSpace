   let cart = []
   let favorites = 0
   let currentFilter = "all"

   const cartButton = document.getElementById("cartButton")
   const cartPanel = document.getElementById("cartPanel")
   const closeCart = document.getElementById("closeCart")
   const overlay = document.getElementById("overlay")
   const cartList = document.getElementById("cartList")
   const cartCount = document.getElementById("cartCount")
   const cartTotal = document.getElementById("cartTotal")
   const favoriteCount = document.getElementById("favoriteCount")
   const searchInput = document.getElementById("searchInput")
   const toast = document.getElementById("toast")

   function formatMoney(number) {
       return number.toLocaleString("vi-VN") + "đ"
   }

   function showToast(text) {
       toast.textContent = text
       toast.classList.add("show")
       setTimeout(function() {
           toast.classList.remove("show")
       }, 1800)
   }

   function openCart() {
       cartPanel.classList.add("open")
       overlay.classList.add("show")
   }

   function hideCart() {
       cartPanel.classList.remove("open")
       overlay.classList.remove("show")
   }

   function addToCart(name, price, icon) {
       const oldItem = cart.find(function(item) {
           return item.name === name
       })

       if (oldItem) {
           oldItem.quantity += 1
       } else {
           cart.push({
               name: name,
               price: price,
               icon: icon,
               quantity: 1
           })
       }

       updateCart()
       showToast("Đã thêm " + name + " vào giỏ")
   }

   function changeQuantity(index, number) {
       cart[index].quantity += number

       if (cart[index].quantity <= 0) {
           cart.splice(index, 1)
       }

       updateCart()
   }

   function removeItem(index) {
       cart.splice(index, 1)
       updateCart()
       showToast("Đã xóa sản phẩm")
   }

   function updateCart() {
       let totalItems = 0
       let totalMoney = 0
       cartList.innerHTML = ""

       if (cart.length === 0) {
           cartList.innerHTML = '<div class="empty-text">Giỏ hàng đang trống 🐣</div>'
       }

       cart.forEach(function(item, index) {
           totalItems += item.quantity
           totalMoney += item.price * item.quantity

           cartList.innerHTML += `
          <div class="cart-item">
            <div class="cart-icon">${item.icon}</div>
            <div>
              <div class="cart-name">${item.name}</div>
              <div>${formatMoney(item.price)}</div>
              <div class="quantity">
                <button onclick="changeQuantity(${index}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="changeQuantity(${index}, 1)">＋</button>
              </div>
            </div>
            <button class="remove-item" onclick="removeItem(${index})">🗑️</button>
          </div>
        `
       })

       cartCount.textContent = totalItems
       cartTotal.textContent = formatMoney(totalMoney)
   }

   function filterProducts() {
       const keyword = searchInput.value.toLowerCase().trim()
       const cards = document.querySelectorAll(".product-card")

       cards.forEach(function(card) {
           const name = card.dataset.name.toLowerCase()
           const category = card.dataset.category
           const matchName = name.includes(keyword)
           const matchCategory = currentFilter === "all" || category === currentFilter

           card.style.display = matchName && matchCategory ? "block" : "none"
       })
   }

   document.querySelectorAll(".small-add, .add-button").forEach(function(button) {
       button.addEventListener("click", function() {
           addToCart(button.dataset.name, Number(button.dataset.price), button.dataset.icon)
       })
   })

   document.querySelectorAll(".heart").forEach(function(button) {
       button.addEventListener("click", function() {
           const active = button.textContent === "♥"
           button.textContent = active ? "♡" : "♥"
           button.style.color = active ? "#493f5c" : "#ff5f7d"
           favorites += active ? -1 : 1
           favoriteCount.textContent = favorites
           showToast(active ? "Đã bỏ yêu thích" : "Đã thêm vào yêu thích")
       })
   })

   document.querySelectorAll(".filter-button").forEach(function(button) {
       button.addEventListener("click", function() {
           document.querySelectorAll(".filter-button").forEach(function(item) {
               item.classList.remove("active")
           })
           button.classList.add("active")
           currentFilter = button.dataset.filter
           filterProducts()
       })
   })

   document.querySelectorAll(".category-card").forEach(function(card) {
       card.addEventListener("click", function() {
           currentFilter = card.dataset.filter
           document.querySelectorAll(".filter-button").forEach(function(button) {
               button.classList.toggle("active", button.dataset.filter === currentFilter)
           })
           document.getElementById("products").scrollIntoView()
           filterProducts()
       })
   })

   searchInput.addEventListener("input", filterProducts)
   cartButton.addEventListener("click", openCart)
   closeCart.addEventListener("click", hideCart)
   overlay.addEventListener("click", hideCart)

   document.getElementById("discoverButton").addEventListener("click", function() {
       document.getElementById("products").scrollIntoView()
   })

   document.getElementById("collectionButton").addEventListener("click", function() {
       document.getElementById("category").scrollIntoView()
   })

   document.getElementById("favoriteButton").addEventListener("click", function() {
       showToast("Bạn đang thích " + favorites + " sản phẩm")
   })

   document.getElementById("giftButton").addEventListener("click", function() {
       const codes = ["MOCHI10", "CUTE15", "HAPPY20"]
       const code = codes[Math.floor(Math.random() * codes.length)]
       showToast("Mã quà của bạn: " + code)
   })

   document.getElementById("checkoutButton").addEventListener("click", function() {
       if (cart.length === 0) {
           showToast("Bạn chưa chọn sản phẩm nào")
       } else {
           cart = []
           updateCart()
           hideCart()
           showToast("Đặt hàng thành công 🎉")
       }
   })

   updateCart()