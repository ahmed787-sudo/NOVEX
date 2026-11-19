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
const nav=document.querySelector(".main-nav");
const menu=$("#categoryMenu");
const categoriesToggle=$("#categoriesToggle");
function renderCategories(){
 if(!menu)return;
 menu.innerHTML=categories.map(c=>`<a class="menu-category-card" href="${c.id}.html"><span>${c.icon}</span><strong>${c.name}</strong><small>${c.description}</small></a>`).join("");
}
function setCategoryMenu(open){
 if(!menu||!categoriesToggle)return;
 menu.hidden=!open;
 categoriesToggle.setAttribute("aria-expanded",String(open));
 categoriesToggle.classList.toggle("active",open);
}
if(categoriesToggle)categoriesToggle.addEventListener("click",()=>setCategoryMenu(menu.hidden));
const heroLink=$("#heroCategoriesLink");
if(heroLink)heroLink.addEventListener("click",event=>{event.preventDefault();setCategoryMenu(menu.hidden);if(menu.hidden===false)menu.scrollIntoView({behavior:"smooth",block:"start"});});
const toggle=$("#menuToggle");
if(toggle&&nav)toggle.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
if(nav)nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
if(menu)menu.addEventListener("click",event=>{if(event.target.closest("a"))setCategoryMenu(false);});
document.addEventListener("click",event=>{if(menu&&!menu.hidden&&!menu.contains(event.target)&&!categoriesToggle?.contains(event.target)&&!heroLink?.contains(event.target))setCategoryMenu(false);});
const year=$("#year");if(year)year.textContent=new Date().getFullYear();
renderCategories();
