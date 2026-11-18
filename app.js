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
const $=selector=>document.querySelector(selector);
const money=value=>value.toLocaleString("en-US")+" ج.م";
let cart=[];
try{cart=JSON.parse(localStorage.getItem("novex-cart")||"[]");if(!Array.isArray(cart))cart=[];}catch{cart=[];}
let activeCategory="الكل";
function renderProducts(){
 const term=$("#searchInput").value.trim().toLocaleLowerCase("ar");
 const visible=products.filter(product=>(activeCategory==="الكل"||product.category===activeCategory)&&product.name.toLocaleLowerCase("ar").includes(term));
 $("#resultCount").textContent=visible.length+" منتجات";
 $("#productGrid").innerHTML=visible.length?visible.map(product=>`<article class="product-card"><div class="product-image" aria-hidden="true">${product.icon}</div><div class="product-info"><span class="category">${product.category}</span><h3>${product.name}</h3><div class="product-bottom"><span class="price">${money(product.price)}</span><button class="add-btn" type="button" data-add="${product.id}">أضف للسلة</button></div></div></article>`).join(""):'<p class="empty">مفيش منتجات مطابقة لبحثك.</p>';
}
function saveCart(){try{localStorage.setItem("novex-cart",JSON.stringify(cart));}catch{}renderCart();}
function renderCart(){
 $("#cartCount").textContent=cart.reduce((sum,item)=>sum+item.qty,0);
 $("#cartItems").innerHTML=cart.length?cart.map(item=>{const product=products.find(entry=>entry.id===item.id);if(!product)return "";return `<div class="cart-row"><div><strong>${product.name}</strong><small>${money(product.price)} للقطعة</small></div><div class="qty"><button type="button" data-dec="${product.id}" aria-label="تقليل الكمية">−</button><b>${item.qty}</b><button type="button" data-inc="${product.id}" aria-label="زيادة الكمية">+</button></div></div>`}).join(""):'<p class="empty">لسه ما ضفتش منتجات للسلة.</p>';
 $("#cartTotal").textContent=money(cart.reduce((sum,item)=>{const product=products.find(entry=>entry.id===item.id);return sum+(product?product.price*item.qty:0);},0));
}
function toggleCart(open){$("#cartPanel").classList.toggle("open",open);$("#scrim").classList.toggle("show",open);$("#cartPanel").setAttribute("aria-hidden",String(!open));}
$("#productGrid").addEventListener("click",event=>{
 const button=event.target.closest("[data-add]");if(!button)return;
 const id=Number(button.dataset.add),item=cart.find(entry=>entry.id===id);
 if(item)item.qty++;else cart.push({id,qty:1});
 saveCart();button.textContent="اتضافت للسلة ✓";setTimeout(()=>{if(button.isConnected)button.textContent="أضف للسلة";},1000);
});
$("#cartItems").addEventListener("click",event=>{
 const increase=event.target.closest("[data-inc]"),decrease=event.target.closest("[data-dec]");if(!increase&&!decrease)return;
 const id=Number((increase||decrease).dataset[increase?"inc":"dec"]),item=cart.find(entry=>entry.id===id);
 if(increase)item.qty++;else item.qty--;
 cart=cart.filter(entry=>entry.qty>0);saveCart();
});
$("#filters").addEventListener("click",event=>{
 const button=event.target.closest("[data-category]");if(!button)return;
 activeCategory=button.dataset.category;
 document.querySelectorAll(".filter").forEach(filter=>filter.classList.toggle("active",filter===button));
 renderProducts();
});
$("#searchInput").addEventListener("input",renderProducts);
$("#cartToggle").addEventListener("click",()=>toggleCart(true));
$("#closeCart").addEventListener("click",()=>toggleCart(false));
$("#scrim").addEventListener("click",()=>toggleCart(false));
$("#checkoutBtn").addEventListener("click",()=>alert("استقبال الطلبات لسه مش متفعّل. دي نسخة عرض للمتجر، ولازم نربطها بوسيلة تواصل وقاعدة بيانات قبل البيع."));
$("#year").textContent=new Date().getFullYear();
renderProducts();renderCart();