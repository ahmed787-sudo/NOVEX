const categories=[
{ id:"electronics",name:"الإلكترونيات",icon:"⌁",description:"أجهزة وتقنيات" },
{ id:"mobiles",name:"موبايلات وتابلت",icon:"▯",description:"هواتف وملحقاتها" },
{ id:"computers",name:"كمبيوتر ولابتوب",icon:"▱",description:"أجهزة وملحقات" },
{ id:"fashion",name:"ملابس وأزياء",icon:"◇",description:"ستايلات متنوعة" },
{ id:"shoes",name:"أحذية وشنط",icon:"⌑",description:"أحذية وحقائب" },
{ id:"beauty",name:"جمال وعناية",icon:"✧",description:"عناية شخصية" },
{ id:"home",name:"المنزل والمطبخ",icon:"⌂",description:"كل احتياجات البيت" },
{ id:"appliances",name:"أجهزة منزلية",icon:"▣",description:"أجهزة للمنزل" },
{ id:"sports",name:"رياضة ولياقة",icon:"◉",description:"معدات وملابس رياضية" },
{ id:"gifts",name:"هدايا ومناسبات",icon:"✳",description:"هدايا لكل مناسبة" }
];
const API_CONFIG={enabled:false,baseUrl:"",productsPath:"/products"};
const $=selector=>document.querySelector(selector);
let selectedCategory="all";
function renderCategories(){
 $("#categoryGrid").innerHTML=categories.map(category=>`<button type="button" class="category-card" data-category="${category.id}"><span class="category-icon" aria-hidden="true">${category.icon}</span><span class="category-name">${category.name}</span><span class="category-meta"><span>${category.description}</span><b>←</b></span></button>`).join("");
}
function selectCategory(id){
 selectedCategory=id;
 document.querySelectorAll(".category-card").forEach(card=>card.classList.toggle("selected",card.dataset.category===id));
 const category=categories.find(item=>item.id===id);
 $("#catalogTitle").textContent=category?category.name:"الكتالوج";
 $("#catalogHint").textContent=category?"عرض منتجات القسم عند ربط مصدر المنتجات.":"المنتجات هتظهر هنا عند ربط مصدر المنتجات.";
 $("#catalog").scrollIntoView({behavior:"smooth"});
 renderEmptyState();
}
function renderEmptyState(){
 $("#productGrid").hidden=true;
 $("#productGrid").innerHTML="";
 $("#productState").hidden=false;
}
async function loadProducts(){
 renderEmptyState();
 if(!API_CONFIG.enabled||!API_CONFIG.baseUrl)return;
 // The API integration is intentionally disabled until a real provider and response schema are configured.
}
$("#categoryGrid").addEventListener("click",event=>{
 const card=event.target.closest("[data-category]");if(card)selectCategory(card.dataset.category);
});
$("#clearFilter").addEventListener("click",()=>{selectedCategory="all";document.querySelectorAll(".category-card").forEach(card=>card.classList.remove("selected"));$("#catalogTitle").textContent="الكتالوج";$("#catalogHint").textContent="المنتجات هتظهر هنا عند ربط مصدر المنتجات.";renderEmptyState();});
$("#searchInput").addEventListener("input",()=>{if(!$("#searchInput").value.trim()){renderEmptyState();return;}$("#productState").querySelector("h3").textContent="الكتالوج فاضي حاليًا";$("#productState").querySelector("p").textContent="مفيش منتجات مضافة للبحث فيها. أضف منتجات من مصدر المنتجات بعد ربط الـ API.";});
$("#menuToggle").addEventListener("click",()=>$("#mainNav")?.classList.toggle("open"));
const nav=document.querySelector(".main-nav");
$("#menuToggle").addEventListener("click",()=>nav.classList.toggle("open"));
nav.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>nav.classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
renderCategories();loadProducts();
