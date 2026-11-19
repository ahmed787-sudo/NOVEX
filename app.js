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
{ id:"gifts",name:"هدايا ومناسبات",icon:"✳",description:"هدايا لكل مناسبة"}
];
const $=selector=>document.querySelector(selector);
let allProducts=[];
function renderCategories(){
 $("#categoryGrid").innerHTML=categories.map(c=>`<a class="category-card" href="${c.id}.html"><span class="category-icon" aria-hidden="true">${c.icon}</span><span class="category-name">${c.name}</span><span class="category-meta"><span>${c.description}</span><b>←</b></span></a>`).join("");
}
function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderProducts(){
 const query=$("#searchInput").value.trim().toLocaleLowerCase();
 const filtered=allProducts.filter(p=>!query||(p.name+" "+(p.description||"")).toLocaleLowerCase().includes(query));
 $("#productState").hidden=filtered.length>0;
 $("#productGrid").hidden=filtered.length===0;
 if(!filtered.length){
   $("#productState").querySelector("h3").textContent=allProducts.length?"مفيش منتجات مطابقة":"لسه مفيش منتجات مضافة";
   $("#productState").querySelector("p").textContent=allProducts.length?"جرّب كلمة بحث تانية.":"المنتجات اللي هتضيفها من لوحة الإدارة هتظهر هنا تلقائيًا.";
   $("#productGrid").innerHTML="";return;
 }
 $("#productGrid").innerHTML=filtered.map(p=>{
   const category=categories.find(c=>c.id===p.category_id)?.name||"NOVEX";
   const image=p.image_url? `<img src="${safe(p.image_url)}" alt="${safe(p.name)}" loading="lazy" onerror="this.parentElement.textContent='NOVEX'">`:"NOVEX";
   return `<article class="product-card"><div class="product-image">${image}</div><div class="product-info"><span class="product-category">${safe(category)}</span><h3>${safe(p.name)}</h3><strong>${Number(p.price).toFixed(2)} جنيه</strong>${p.compare_at_price? ` <del>${Number(p.compare_at_price).toFixed(2)} جنيه</del>`:""}<p>${safe(p.description||"")}</p></div></article>`;
 }).join("");
}
async function loadProducts(){
 if(!window.NOVEX_CONFIG?.supabaseUrl||!window.NOVEX_CONFIG?.supabaseAnonKey||!window.supabase){$("#catalogHint").textContent="الكتالوج جاهز، وسيظهر عند توصيل قاعدة البيانات.";return;}
 const client=window.supabase.createClient(window.NOVEX_CONFIG.supabaseUrl,window.NOVEX_CONFIG.supabaseAnonKey);
 const {data,error}=await client.from("products").select("id,name,description,category_id,price,compare_at_price,image_url").eq("is_active",true).order("created_at",{ascending:false});
 if(error){$("#catalogHint").textContent="تعذر تحميل المنتجات حاليًا.";return;}
 allProducts=data||[];renderProducts();
}
$("#searchInput").addEventListener("input",renderProducts);
const nav=document.querySelector(".main-nav");
$("#menuToggle").addEventListener("click",()=>{const open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
$("#year").textContent=new Date().getFullYear();renderCategories();loadProducts();
