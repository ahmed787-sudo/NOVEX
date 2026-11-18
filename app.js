const products=[
{id:1,name:"سماعة لاسلكية",category:"إلكترونيات",price:650,icon:"🎧"},
{id:2,name:"ساعة ذكية",category:"إلكترونيات",price:950,icon:"⌚"},
{id:3,name:"تيشيرت أساسي",category:"ملابس",price:280,icon:"👕"},
{id:4,name:"حقيبة يومية",category:"إكسسوارات",price:420,icon:"🎒"},
{id:5,name:"مصباح مكتبي",category:"منزل",price:350,icon:"💡"},
{id:6,name:"نظارة شمسية",category:"إكسسوارات",price:300,icon:"🕶️"},
{id:7,name:"حذاء رياضي",category:"ملابس",price:780,icon:"👟"},
{id:8,name:"كوب حراري",category:"منزل",price:220,icon:"☕"}
];
let cart=JSON.parse(localStorage.getItem("novex-cart")||"[]");
let activeCategory="الكل";
const $=s=>document.querySelector(s);
const money=n=>n.toLocaleString("en-US")+" ج.م";
function renderProducts(){
 const term=$("#searchInput").value.trim().toLowerCase();
 const shown=products.filter(p=>(activeCategory==="الكل"||p.category===activeCategory)&&p.name.toLowerCase().includes(term));
 $("#resultCount").textContent=shown.length+" منتجات";
 $("#productGrid").innerHTML=shown.length?shown.map(p=>`<article class="product-card"><div class="product-image">${p.icon}</div><div class="product-info"><span class="category">${p.category}</span><h3>${p.name}</h3><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add-btn" data-add="${p.id}">أضف للسلة +</button></div></div></article>`).join(""):'<p class="empty">لا توجد منتجات مطابقة لبحثك.</p>';
}
function saveCart(){localStorage.setItem("novex-cart",JSON.stringify(cart));renderCart()}
function renderCart(){
 $("#cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
 $("#cartItems").innerHTML=cart.length?cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-row"><div><strong>${p.name}</strong><small>${money(p.price)} للقطعة</small></div><div class="qty"><button data-dec="${p.id}">−</button><b>${item.qty}</b><button data-inc="${p.id}">+</button></div></div>`}).join(""):'<p class="empty">السلة فارغة حاليًا.</p>';
 $("#cartTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function openCart(open){$("#cartPanel").classList.toggle("open",open);$("#scrim").classList.toggle("show",open);$("#cartPanel").setAttribute("aria-hidden",String(!open))}
$("#productGrid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add),item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});saveCart();b.textContent="تمت الإضافة ✓";setTimeout(()=>b.textContent="أضف للسلة +",900)});
$("#cartItems").addEventListener("click",e=>{const inc=e.target.closest("[data-inc]"),dec=e.target.closest("[data-dec]");if(!inc&&!dec)return;const id=Number((inc||dec).dataset[inc?"inc":"dec"]),item=cart.find(x=>x.id===id);if(inc)item.qty++;else item.qty--;cart=cart.filter(x=>x.qty>0);saveCart()});
$("#filters").addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(!b)return;activeCategory=b.dataset.category;document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x===b));renderProducts()});
$("#searchInput").addEventListener("input",renderProducts);
$("#cartToggle").addEventListener("click",()=>openCart(true));
$("#closeCart").addEventListener("click",()=>openCart(false));
$("#scrim").addEventListener("click",()=>openCart(false));
$("#checkoutBtn").addEventListener("click",()=>{if(!cart.length){alert("أضف منتجات إلى السلة أولًا.");return}alert("السلة تعمل محليًا. لتفعيل الطلبات الحقيقية، اربط بيانات العميل وخدمة استقبال الطلبات أو بوابة دفع آمنة.");});
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();