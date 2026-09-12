const snacks = [
  {id:'cookie',name:'Chocolate chip cookie',price:150,emoji:'🍪'},
  {id:'chips',name:'Classic potato chips',price:100,emoji:'🥔'},
  {id:'brownie',name:'Fudge brownie',price:200,emoji:'🍫'},
  {id:'pretzels',name:'Mini pretzels',price:100,emoji:'🥨'},
  {id:'gummies',name:'Fruit gummies',price:100,emoji:'🍓'},
  {id:'juice',name:'Juice box',price:100,emoji:'🧃'}
];
snacks[0].image='https://images.unsplash.com/photo-1719384980808-0f3b833a2468?auto=format&fit=crop&w=900&q=85';
snacks[1].image='https://images.unsplash.com/photo-1641693148759-843d17ceac24?auto=format&fit=crop&w=900&q=85';
snacks[2].image='https://images.unsplash.com/photo-1688279432554-16cd6de375ac?auto=format&fit=crop&w=900&q=85';
const cart = new Map();
const money = cents => '$' + (cents / 100).toFixed(2);
const grid = document.querySelector('#snack-grid');
const dialog = document.querySelector('#order-dialog');
const status = document.querySelector('#status');
function renderMenu() {
  grid.innerHTML = snacks.map(snack => `<article class="snack-card"><div class="snack-image">${snack.image ? `<img src="${snack.image}" alt="${snack.name}" width="600" height="400">` : `<span class="emoji" aria-hidden="true">${snack.emoji}</span>`}</div><div class="card-content"><h3>${snack.name}</h3><div class="card-bottom"><span class="price">${money(snack.price)}</span><button class="add-button" data-add="${snack.id}" aria-label="Add ${snack.name}">Add <span aria-hidden="true">+</span></button></div></div></article>`).join('');
}
function summary() {
  return {items:snacks.filter(s=>cart.has(s.id)).map(s=>({id:s.id,name:s.name,quantity:cart.get(s.id),subtotal:s.price*cart.get(s.id)})),total:snacks.reduce((sum,s)=>sum+s.price*(cart.get(s.id)||0),0)};
}
function renderOrder() {
  const order=summary();
  document.querySelector('#cart-count').textContent=order.items.reduce((n,s)=>n+s.quantity,0);
  document.querySelector('#order-items').innerHTML=order.items.length ? order.items.map(s=>`<div class="order-row"><div><h3>${s.name}</h3><p>${money(s.subtotal)}</p></div><div class="quantity"><button data-change="${s.id}" data-delta="-1" aria-label="Remove one ${s.name}">−</button><span aria-label="Quantity">${s.quantity}</span><button data-change="${s.id}" data-delta="1" aria-label="Add one ${s.name}" ${s.quantity>=99?'disabled':''}>+</button></div></div>`).join('') : '<p class="empty-order">Nothing here yet. Pick a snack you like.</p>';
  document.querySelector('#order-total').textContent=money(order.total);
  document.querySelector('#show-pickup').disabled=!order.items.length;
  document.querySelector('#pickup-message').hidden=true;
}
function changeQuantity(id,delta){
  const snack=snacks.find(s=>s.id===id);
  if(!snack || !Number.isInteger(delta)) throw new Error('Choose a valid snack and whole-number quantity.');
  const next=(cart.get(id)||0)+delta;
  if(next<0 || next>99) throw new Error('Quantity must be between 0 and 99.');
  if(next===0)cart.delete(id);else cart.set(id,next);
  renderOrder();status.textContent=`${snack.name}: ${next} in your order.`;
  return summary();
}
grid.addEventListener('click',event=>{const button=event.target.closest('[data-add]');if(!button)return;try{changeQuantity(button.dataset.add,1)}catch(error){status.textContent=error.message}});
document.querySelector('#order-items').addEventListener('click',event=>{const button=event.target.closest('[data-change]');if(!button)return;const id=button.dataset.change,delta=Number(button.dataset.delta);changeQuantity(id,delta);const next=dialog.querySelector(`[data-change="${id}"][data-delta="${delta}"]`) || dialog.querySelector('[data-change]') || document.querySelector('#keep-browsing');next.focus()});
function closeOrder(){dialog.close();document.body.classList.remove('dialog-open')}
document.querySelector('#open-order').addEventListener('click',()=>{renderOrder();dialog.showModal();document.body.classList.add('dialog-open')});
document.querySelector('#close-order').addEventListener('click',closeOrder);
document.querySelector('#keep-browsing').addEventListener('click',closeOrder);
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)closeOrder()}});
document.querySelector('#show-pickup').addEventListener('click',()=>{const message=document.querySelector('#pickup-message');message.hidden=false;message.scrollIntoView({block:'nearest',behavior:'smooth'});status.textContent='Your list is ready to show at pickup. Nothing has been sent or reserved.'});
renderMenu();renderOrder();
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'set_snack_quantity',title:'Set snack quantity',inputSchema:{type:'object',properties:{id:{type:'string',enum:snacks.map(s=>s.id)},quantity:{type:'integer',minimum:0,maximum:99}},required:['id','quantity'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){if(!input||!Number.isInteger(input.quantity)||input.quantity<0||input.quantity>99||!snacks.some(s=>s.id===input.id))throw new Error('Invalid snack or quantity');return changeQuantity(input.id,input.quantity-(cart.get(input.id)||0))}})).catch(()=>{});}catch{}}
