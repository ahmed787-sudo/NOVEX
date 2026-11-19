(() => {
  const categories = [
    ["electronics","الإلكترونيات"],["mobiles","موبايلات وتابلت"],["computers","كمبيوتر ولابتوب"],
    ["fashion","ملابس وأزياء"],["shoes","أحذية وشنط"],["beauty","جمال وعناية"],
    ["home","المنزل والمطبخ"],["appliances","أجهزة منزلية"],["sports","رياضة ولياقة"],["gifts","هدايا ومناسبات"]
  ];
  const $ = id => document.getElementById(id);
  const loginPanel=$("loginPanel"), dashboard=$("dashboard"), loginMessage=$("loginMessage"), formMessage=$("formMessage");
  let client=null, products=[];
  $("productCategory").innerHTML=categories.map(([id,name])=>`<option value="${id}">${name}</option>`).join("");
  function configReady(){return window.VEX_CONFIG?.supabaseUrl && window.VEX_CONFIG?.supabaseAnonKey && window.supabase;}
  function message(el,text,error=false){el.textContent=text;el.style.color=error?"#ffb4a9":"#d2df91";}
  function setLoggedIn(value){loginPanel.hidden=value;dashboard.hidden=!value;}
  async function ensureAdmin(){
    const {data:{user},error}=await client.auth.getUser();
    if(error||!user||user.app_metadata?.role!=="admin"){await client.auth.signOut();setLoggedIn(false);message(loginMessage,"الحساب ده مش مصرح له بدخول لوحة الإدارة.",true);return false;}
    setLoggedIn(true);await loadProducts();return true;
  }
  async function loadProducts(){
    $("adminProductList").innerHTML="<p>جاري تحميل المنتجات...</p>";
    const {data,error}=await client.from("products").select("*").order("created_at",{ascending:false});
    if(error){$("adminProductList").innerHTML="";message(formMessage,"تعذر تحميل المنتجات: "+error.message,true);return;}
    products=data||[];
    $("totalProducts").textContent=products.length;
    $("activeProducts").textContent=products.filter(p=>p.is_active).length;
    if(!products.length){$("adminProductList").innerHTML='<p class="admin-empty">لا توجد منتجات حتى الآن.</p>';return;}
    $("adminProductList").innerHTML=products.map(p=>{const category=categories.find(c=>c[0]===p.category_id)?.[1]||p.category_id;return `<article class="admin-product"><img src="${escapeAttr(p.image_url||"")}" alt="" onerror="this.style.display='none'"><div class="admin-product-info"><strong>${escapeHtml(p.name)}</strong><small>${Number(p.price).toFixed(2)} جنيه · ${escapeHtml(category)} · المخزون: ${p.stock} · ${p.is_active?"ظاهر":"مخفي"}</small></div><div class="admin-product-actions"><button type="button" data-edit="${p.id}">تعديل</button><button type="button" class="delete" data-delete="${p.id}">حذف</button></div></article>`;}).join("");
  }
  function escapeHtml(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
  function escapeAttr(s){return escapeHtml(s);}
  function resetForm(){ $("productForm").reset();$("productId").value="";$("productStock").value="0";$("productActive").checked=true;$("formTitle").textContent="إضافة منتج جديد";message(formMessage,""); }
  function editProduct(id){const p=products.find(x=>x.id===id);if(!p)return;$("productId").value=p.id;$("productName").value=p.name;$("productCategory").value=p.category_id;$("productPrice").value=p.price;$("productComparePrice").value=p.compare_at_price??"";$("productStock").value=p.stock;$("productImage").value=p.image_url||"";$("productDescription").value=p.description||"";$("productActive").checked=p.is_active;$("formTitle").textContent="تعديل المنتج";window.scrollTo({top:0,behavior:"smooth"});}
  $("loginForm").addEventListener("submit",async e=>{e.preventDefault();if(!configReady()){message(loginMessage,"ملف config.js غير موجود أو إعدادات Supabase ناقصة.",true);return;}client=window.supabase.createClient(window.VEX_CONFIG.supabaseUrl,window.VEX_CONFIG.supabaseAnonKey);message(loginMessage,"جاري التحقق...");const {error}=await client.auth.signInWithPassword({email:$("adminEmail").value.trim(),password:$("adminPassword").value});if(error){message(loginMessage,"فشل تسجيل الدخول: "+error.message,true);return;}await ensureAdmin();});
  $("productForm").addEventListener("submit",async e=>{e.preventDefault();const id=$("productId").value;const payload={name:$("productName").value.trim(),category_id:$("productCategory").value,price:Number($("productPrice").value),compare_at_price:$("productComparePrice").value?Number($("productComparePrice").value):null,stock:Number($("productStock").value),image_url:$("productImage").value.trim(),description:$("productDescription").value.trim(),is_active:$("productActive").checked,updated_at:new Date().toISOString()};if(!payload.name||!Number.isFinite(payload.price)||payload.price<0||payload.stock<0){message(formMessage,"راجع اسم المنتج والسعر والكمية.",true);return;}const query=id?client.from("products").update(payload).eq("id",id):client.from("products").insert(payload);const {error}=await query;if(error){message(formMessage,"لم يتم الحفظ: "+error.message,true);return;}message(formMessage,"تم حفظ المنتج.");resetForm();await loadProducts();});
  $("adminProductList").addEventListener("click",async e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit){editProduct(edit.dataset.edit);return;}if(del){const p=products.find(x=>x.id===del.dataset.delete);if(!p||!confirm("حذف المنتج: "+p.name+" ؟"))return;const {error}=await client.from("products").delete().eq("id",p.id);if(error){message(formMessage,"تعذر الحذف: "+error.message,true);return;}await loadProducts();}});
  $("resetForm").addEventListener("click",resetForm);$("refreshProducts").addEventListener("click",loadProducts);
  $("logoutButton").addEventListener("click",async()=>{await client.auth.signOut();setLoggedIn(false);});
  if(configReady()){client=window.supabase.createClient(window.VEX_CONFIG.supabaseUrl,window.VEX_CONFIG.supabaseAnonKey);client.auth.getSession().then(({data})=>{if(data.session)ensureAdmin();});}
})();