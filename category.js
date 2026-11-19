const categories=[
{id:"electronics",name:"الإلكترونيات",description:"أجهزة وتقنيات ومنتجات إلكترونية"},
{id:"mobiles",name:"موبايلات وتابلت",description:"هواتف ذكية وأجهزة تابلت وملحقاتها"},
{id:"computers",name:"كمبيوتر ولابتوب",description:"أجهزة الكمبيوتر واللابتوب وملحقاتها"},
{id:"fashion",name:"ملابس وأزياء",description:"اختيارات متنوعة من الملابس والأزياء"},
{id:"shoes",name:"أحذية وشنط",description:"أحذية وحقائب للاستخدام اليومي"},
{id:"beauty",name:"جمال وعناية",description:"منتجات الجمال والعناية الشخصية"},
{id:"home",name:"المنزل والمطبخ",description:"احتياجات المنزل والمطبخ"},
{id:"appliances",name:"أجهزة منزلية",description:"أجهزة تساعدك في احتياجات البيت"},
{id:"sports",name:"رياضة ولياقة",description:"معدات ومنتجات الرياضة واللياقة"},
{id:"gifts",name:"هدايا ومناسبات",description:"هدايا واختيارات للمناسبات المختلفة"}
];
const $=s=>document.querySelector(s);
const categoryId=document.body.dataset.category;
const category=categories.find(c=>c.id===categoryId);
let products=[];
function safe(value){return String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function showMessage(title,message){$("#productState").hidden=false;$("#productGrid").hidden=true;$("#productState h3").textContent=title;$("#productState p").textContent=message;}
function render(){
 const q=$("#searchInput").value.trim().toLocaleLowerCase();
 const filtered=products.filter(p=>(p.name+" "+(p.description||"")).toLocaleLowerCase().includes(q));
 if(!filtered.length){showMessage(products.length?"مفيش منتجات مطابقة":"لسه مفيش منتجات مضافة",products.length?"جرّب كلمة بحث تانية.":"المنتجات اللي هتضيفها من لوحة الإدارة للقسم ده هتظهر هنا تلقائيًا.");$("#productGrid").innerHTML="";return;}
 $("#productState").hidden=true;$("#productGrid").hidden=false;
 $("#productGrid").innerHTML=filtered.map(p=>{
  const image=p.image_url?`<img src="${safe(p.image_url)}" alt="${safe(p.name)}" loading="lazy" onerror="this.parentElement.textContent='VEX'">`:"VEX";
  return `<article class="product-card"><div class="product-image">${image}</div><div class="product-info"><span class="product-category">${safe(category.name)}</span><h3>${safe(p.name)}</h3><strong>${Number(p.price).toFixed(2)} جنيه</strong>${p.compare_at_price?` <del>${Number(p.compare_at_price).toFixed(2)} جنيه</del>`:""}<p>${safe(p.description||"")}</p></div></article>`;
 }).join("");
}
async function load(){
 if(!window.NOVEX_CONFIG?.supabaseUrl||!window.NOVEX_CONFIG?.supabaseAnonKey||!window.supabase){$("#catalogHint").textContent="قاعدة البيانات غير متصلة حاليًا.";return;}
 const client=window.supabase.createClient(window.NOVEX_CONFIG.supabaseUrl,window.NOVEX_CONFIG.supabaseAnonKey);
 const {data,error}=await client.from("products").select("id,name,description,category_id,price,compare_at_price,image_url").eq("is_active",true).eq("category_id",category.id).order("created_at",{ascending:false});
 if(error){showMessage("تعذر تحميل المنتجات","راجع اتصال قاعدة البيانات ثم حاول مرة أخرى.");return;}
 products=data||[];render();
}
if(!category){document.title="القسم غير موجود | VEX";$("#categoryTitle").textContent="القسم غير موجود";$("#categoryDescription").textContent="ارجع إلى الصفحة الرئيسية واختر قسمًا من الأقسام المتاحة.";showMessage("القسم غير موجود","يمكنك الرجوع إلى كل الأقسام واختيار القسم المطلوب.");}
else{document.title=category.name+" | VEX";$("#categoryTitle").textContent=category.name;$("#catalogTitle").textContent="منتجات "+category.name;$("#categoryDescription").textContent=category.description;load();}
$("#searchInput").addEventListener("input",render);
const nav=document.querySelector(".main-nav");
$("#menuToggle").addEventListener("click",()=>{const open=nav.classList.toggle("open");$("#menuToggle").setAttribute("aria-expanded",String(open));});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
$("#year").textContent=new Date().getFullYear();
