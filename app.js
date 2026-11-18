const categories=[
{ id:"electronics",name:"الإلكترونيات",icon:"⌁",description:"موبايلات وأجهزة وتقنيات" },
{ id:"mobiles",name:"موبايلات وتابلت",icon:"▯",description:"هواتف وملحقاتها" },
{ id:"computers",name:"كمبيوتر ولابتوب",icon:"▱",description:"أجهزة وملحقات الكمبيوتر" },
{ id:"fashion",name:"ملابس وأزياء",icon:"◇",description:"ملابس لكل أفراد الأسرة" },
{ id:"shoes",name:"أحذية وشنط",icon:"⌑",description:"أحذية وحقائب متنوعة" },
{ id:"beauty",name:"جمال وعناية",icon:"✧",description:"عناية شخصية ومستحضرات" },
{ id:"home",name:"المنزل والمطبخ",icon:"⌂",description:"مستلزمات البيت والمطبخ" },
{ id:"furniture",name:"أثاث وديكور",icon:"▤",description:"أثاث ولمسات للمنزل" },
{ id:"appliances",name:"أجهزة منزلية",icon:"▣",description:"أجهزة كهربائية للبيت" },
{ id:"sports",name:"رياضة ولياقة",icon:"◉",description:"معدات وملابس رياضية" },
{ id:"toys",name:"ألعاب وأطفال",icon:"☆",description:"ألعاب ومستلزمات الصغار" },
{ id:"baby",name:"مستلزمات الأطفال",icon:"♧",description:"احتياجات الطفل والأم" },
{ id:"books",name:"كتب ومكتبات",icon:"▥",description:"كتب وأدوات مكتبية" },
{ id:"automotive",name:"سيارات وإكسسوارات",icon:"⌕",description:"مستلزمات وعناية بالسيارة" },
{ id:"pets",name:"مستلزمات الحيوانات",icon:"♡",description:"احتياجات الحيوانات الأليفة" },
{ id:"grocery",name:"سوبر ماركت",icon:"▦",description:"منتجات يومية وغذائية" },
{ id:"office",name:"مكتب وأعمال",icon:"▧",description:"أدوات ومستلزمات العمل" },
{ id:"gifts",name:"هدايا ومناسبات",icon:"✳",description:"هدايا واختيارات للمناسبات" }
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
