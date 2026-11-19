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
function renderCategories(){
 const grid=$("#categoryGrid");
 if(!grid)return;
 grid.innerHTML=categories.map(c=>`<a class="category-card" href="${c.id}.html" aria-label="افتح قسم ${c.name}"><span class="category-icon" aria-hidden="true">${c.icon}</span><span class="category-name">${c.name}</span><span class="category-meta"><span>${c.description}</span><b>←</b></span></a>`).join("");
}
const nav=document.querySelector(".main-nav");
const toggle=$("#menuToggle");
if(toggle&&nav)toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
if(nav)nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
const year=$("#year");if(year)year.textContent=new Date().getFullYear();
renderCategories();
