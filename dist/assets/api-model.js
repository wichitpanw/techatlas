import {apiVisual} from './api-teaching.js?v=api-review-20261007-r2';
const product={id:1,name:'สมุด',price:80};
// Headers/status are not extra application messages. One source for the DOM and tests.
export function apiMessages(model,index){
 let request='ยังไม่ส่ง',head='',rpc='',latest='',received=[];
 for(const frame of model.steps.slice(0,index+1)){
  if(frame.request!==undefined){request=frame.request;if(model.kind==='long-polling'){latest='';head='';}}
  if(frame.sentMessage!==undefined)request+='\n\n'+frame.sentMessage;
  if(frame.responseHead!==undefined)head=frame.responseHead;
  if(frame.rpcStatus!==undefined)rpc=frame.rpcStatus;
  if(frame.response!==undefined){received.push(frame.response);latest=frame.response;}
 }
 const streaming=['sse','grpc','websocket'].includes(model.kind);
 const parts=[head,streaming?received.join('\n\n'):latest,rpc?'RPC status · '+rpc:''].filter(Boolean);
 const round=model.kind==='long-polling'?model.steps.slice(0,index+1).filter(f=>f.request!==undefined).length:1;
 return {request,response:parts.join('\n\n')||'ยังไม่ได้รับคำตอบ',messages:received.length,round,history:model.kind==='long-polling'&&round>1?received.at(-1)||'':''};
}
export function buildAPI(lesson,scenario=0,input={}){
 if(!lesson.apiLab||!Number.isInteger(scenario)||scenario<0||scenario>2)throw Error('เลือกสถานการณ์ API ที่รองรับ');
 const p={id:'1',message:'สมุดใหม่',...input};
 if(!['1','99'].includes(String(p.id)))throw Error('เลือก ID 1 หรือ 99');
 if(typeof p.message!=='string'||p.message.length>80)throw Error('ข้อความต้องยาวไม่เกิน 80 ตัวอักษร');
 const found=String(p.id)==='1',kind=lesson.kind,steps=[],nodes=[],links=[];
 const node=(id,name,address,position,client=false)=>{nodes.push({id,name,address,position,kind:client?'client':'server',logical:!client});return id};
 const link=(a,b)=>{links.push({id:a+'-'+b,from:a,to:b});};
 const move=(from,to,message)=>({from,to,message});
 const add=(title,detail,fields=[],transfers=[],extra={})=>{
  const active=[...new Set(transfers.flatMap(t=>[t.from,t.to]))];
  const frame={title,detail,fields,transfers,active,edges:transfers.map(t=>links.find(e=>[e.from,e.to].includes(t.from)&&[e.from,e.to].includes(t.to))?.id).filter(Boolean),status:'ok',nodeUpdates:{},...extra};steps.push(frame);return frame;
 };
 const value=JSON.stringify(product),response=body=>({response:typeof body==='string'?body:JSON.stringify(body,null,2)});
 if(['basics','rest'].includes(kind)){
  node('client','Client','เลือกสิ่งที่จะขอ',[-5,1],true);node('api','Service / Endpoint','ตรวจคำขอ',[0,-1]);node('data','ข้อมูลของบริการ','สินค้า 1 รายการ',[5,1]);link('client','api');link('api','data');
  const post=kind==='rest'&&scenario===1,invalid=kind==='basics'&&scenario===2,method=kind==='rest'&&scenario===2?'PATCH':post?'POST':'GET',id=invalid?'not-a-number':kind==='basics'&&scenario===1?'99':p.id;
  const request=`${method} ${post?'/products':'/products/'+id}${post?'\nContent-Type: application/json\n\n'+JSON.stringify({name:p.message}):''}`;
  add('Client ประกอบ Request','Endpoint เป็นข้อตกลง ไม่ใช่การเปิดฐานข้อมูลจาก Browser โดยตรง',[['Method',method],['Path',post?'/products':'/products/'+id]],[move('client','api',method+' '+(post?'/products':'/products/'+id))],{request});
  if(method==='PATCH'||invalid||post&&!p.message.trim())add('Service ไม่รับคำขอนี้',method==='PATCH'?'PATCH ไม่ได้รับการ implement ใน resource ตัวอย่างนี้ ไม่ได้แปลว่า HTTP ไม่มี PATCH':invalid?'ID ต้องเป็นตัวเลขตาม contract นี้ ตรวจแล้วไม่ผ่าน จึงหยุดก่อนค้นข้อมูล':'ชื่อสินค้าไม่ควรว่างตาม contract นี้ จึงหยุดก่อนสร้าง',[['HTTP',method==='PATCH'?'405 Method Not Allowed':'400 Bad Request'],['Allow',method==='PATCH'?'GET':'—']],[move('api','client','Error response')],{status:'blocked',...response({error:method==='PATCH'?'method_not_allowed':'invalid_input'})});
  else{
   add(post?'ตรวจข้อมูลและสร้างสินค้า':'ค้น Resource ตาม ID','ข้อมูลเป็น snapshot ใน browser memory เริ่มใหม่ทุกครั้งที่ทดลอง ไม่ใช่ database server จริง',[['Store before',value]],[move('api','data',post?'CREATE name = '+p.message:'READ id = '+id)],{nodeUpdates:{data:post?'สินค้าเดิม + สินค้าใหม่':'ค้น ID '+id}});
   const ok=post||id==='1',body=post?{id:2,name:p.message}:ok?product:{error:'not_found'};
   add('ผลกลับจากข้อมูล','Service จัดผลให้ตรง contract',[['Found / Created',ok]],[move('data','api',ok?'ข้อมูลพร้อม':'ไม่พบ ID')]);
   add('Response กลับถึง Client','HTTP response จบหนึ่งรอบ GET ไม่เปลี่ยนสินค้า POST ตัวอย่างนี้ตอบ ID ใหม่และ Location',[['HTTP',post?'201 Created':ok?'200 OK':'404 Not Found'],['Content-Type','application/json'],['Location',post?'/products/2':'—']],[move('api','client',post?'201 · id 2':ok?'200 · สินค้า':'404 · ไม่พบ')],{status:ok?'ok':'blocked',...response(body),nodeUpdates:{client:ok?'ได้รับข้อมูล':'ได้รับ error'}});
  }
 }else if(kind==='graphql'){
  node('client','Client','Query fields',[-5,1],true);node('schema','Schema','name / price',[0,-2]);node('resolver','Resolver','product(id)',[5,1]);link('client','schema');link('schema','resolver');
  const fields=scenario===0?'name':scenario===1?'name price':'password',request=`query { product(id: ${p.id}) { ${fields} } }`;
  add('ส่ง Query ที่เลือก Fields','นี่คือ query ตัวอย่าง ไม่รัน GraphQL parser จริง',[['Selected',fields]],[move('client','schema','Query: '+fields)],{request});
  if(scenario===2)add('Schema ปฏิเสธ Field','ไม่มี password ใน schema จึงไม่เรียก resolver ไม่มีข้อมูลลับให้ดึง',[['Validation','FAILED'],['Resolver calls',0]],[move('schema','client','errors · unknown field')],{status:'blocked',...response({errors:[{message:'Unknown field password'}]})});
  else{add('Schema ผ่าน → Resolver ทำงาน','Field selection ไม่ได้บอกว่า backend เร็วแค่ไหน',[['Validation','PASS']],[move('schema','resolver','product('+p.id+')')]);const data=found?(scenario===0?{name:product.name}:{name:product.name,price:product.price}):null;add('เลือก Fields กลับ Client','Lab อนุญาต product เป็น nullable; ไม่มี ID นี้ตอบ product:null โดยไม่จำเป็นต้องเป็น execution error',[['HTTP in this mock',200],['Selected fields',fields]],[move('resolver','schema','ผล resolver'),move('schema','client','data')],response({data:{product:data}}));}
 }else if(kind==='grpc'){
  node('client','Client stub','typed call',[-5,1],true);node('codec','Serializer','Protobuf (ภาพย่อ)',[0,-2]);node('service','ProductService','method handler',[5,1]);link('client','codec');link('codec','service');
  const method=scenario===1?'WatchProducts':'GetProduct';add('เรียก Method ผ่าน Stub','Stub/serializer เป็นส่วนของ client pipeline ในภาพ ไม่ใช่เครื่องกลางบนสายจริง',[['Method',method],['Request type','ProductRequest']],[move('client','codec',method+'({id:'+p.id+'})')],{request:`ProductService.${method}({ id: ${p.id} })`});
  add('ส่ง Typed message ไป Service','ข้าม representation เป็น message ไม่แสดง bytes ปลอม และไม่วัด latency',[['Transport in real gRPC','HTTP/2 (ทั่วไป)']],[move('codec','service','typed request')]);
  if(scenario===2)add('Deadline ถึงก่อนผล','Client ไม่ได้รับผลสำเร็จภายใน deadline; ไม่รับประกันว่าฝั่ง server ไม่มี side effect ในระบบจริง',[['gRPC status','DEADLINE_EXCEEDED (4)']],[],{status:'blocked',active:['client'],rpcStatus:'Client: DEADLINE_EXCEEDED (4)'});
  else if(!found&&scenario===0)add('Method ไม่พบสินค้า','สถานะ gRPC ไม่ใช่ HTTP status',[['gRPC status','NOT_FOUND (5)']],[move('service','codec','NOT_FOUND'),move('codec','client','NOT_FOUND')],{status:'blocked',rpcStatus:'Service: NOT_FOUND (5)'});
  else{for(let i=0;i<(scenario===1?2:1);i++)add('Response message '+(i+1),'Messages ใน RPC เดิม ไม่ใช่เปิด request ใหม่ทุก message',[['Message',i+1]],[move('service','codec','Product message '+(i+1)),move('codec','client','decoded message '+(i+1))],response(scenario===1?{event:i+1,product}:product));add('RPC จบด้วย Status','Stream แสดงจบตาม fixture นี้ ไม่ได้จบทุกสอง messages ในระบบจริง',[['gRPC status','OK (0)'],['Response messages',scenario===1?2:1]],[],{rpcStatus:'Service: OK (0)',nodeUpdates:{service:'RPC completed'}});}
 }else if(kind==='soap'){
  node('client','Client','XML Envelope',[-5,1],true);node('contract','Envelope / Contract','SOAP 1.2',[0,-2]);node('service','Service','GetProduct',[5,1]);link('client','contract');link('contract','service');
  const ns=scenario===2?'http://schemas.xmlsoap.org/soap/envelope/':'http://www.w3.org/2003/05/soap-envelope',op=scenario===1?'RemoveEverything':'GetProduct';
  add('XML Envelope → Service','Body ใช้ operation ของ contract ตัวอย่าง ไม่มี arbitrary XML execution',[['Namespace',ns],['Operation',op]],[move('client','contract','Envelope / Body')],{request:`<env:Envelope xmlns:env="${ns}" xmlns:p="urn:techatlas:products"><env:Body><p:${op}><p:id>${p.id}</p:id></p:${op}></env:Body></env:Envelope>`});
  if(scenario>0){const fault=scenario===2?`<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" xmlns:up="http://www.w3.org/2003/05/soap-envelope"><s:Header><s:Upgrade><s:SupportedEnvelope qname="up:Envelope"/></s:Upgrade></s:Header><s:Body><s:Fault><faultcode>s:VersionMismatch</faultcode><faultstring>The product service accepts SOAP 1.2 operations</faultstring></s:Fault></s:Body></s:Envelope>`:`<env:Envelope xmlns:env="http://www.w3.org/2003/05/soap-envelope"><env:Body><env:Fault><env:Code><env:Value>env:Sender</env:Value></env:Code><env:Reason><env:Text xml:lang="en">Unsupported product operation</env:Text></env:Reason></env:Fault></env:Body></env:Envelope>`;add('คืน SOAP Fault',scenario===2?'บริการนี้ไม่รับ operation SOAP 1.1 แต่ตอบ VersionMismatch เป็นโครงสร้าง SOAP 1.1 เพื่อให้ผู้ส่งเดิมอ่านได้ ตาม version transition rules; ไม่เรียก GetProduct':'SOAP 1.2 Sender Fault แจ้งว่าคำขอ operation ไม่อยู่ใน contract',[['Fault',scenario===2?'s:VersionMismatch':'env:Sender'],['Response Envelope',scenario===2?'SOAP 1.1':'SOAP 1.2']],[move('contract','client','SOAP Fault')],{status:'blocked',...response(fault)});}
  else{add('อ่าน Body → เรียก Operation','ย่อการตรวจ contract ไม่ได้รัน WSDL/XSD validator เต็มระบบ',[['Operation','GetProduct']],[move('contract','service','GetProduct id '+p.id)]);add('ส่ง XML Response','การหาข้อมูลอยู่ใน operation ไม่ใช่หน้าที่ของ SOAP เอง',[['Result',found?'Found':'Not found']],[move('service','contract','ผล operation'),move('contract','client','XML Envelope')],response(`<env:Envelope xmlns:env="${ns}" xmlns:p="urn:techatlas:products"><env:Body><p:GetProductResponse><p:found>${found}</p:found>${found?'<p:name>สมุด</p:name>':''}</p:GetProductResponse></env:Body></env:Envelope>`));}
 }else if(kind==='webhooks'){
  node('source','Event producer','ระบบต้นทาง',[-5,1]);node('receiver','Callback backend','/hooks/orders',[0,-2]);node('work','งานที่รับแล้ว','processed = 0',[5,1]);link('source','receiver');link('receiver','work');
  add('เกิด Event ฝั่งต้นทาง','สมมติ callback URL ลงทะเบียนพร้อมแล้ว Producer เป็น HTTP client ของ delivery นี้ ไม่ใช่ browser ของผู้เรียน',[['Event ID','evt-1']],[move('source','receiver','POST /hooks/orders · evt-1')],{request:'POST /hooks/orders\nContent-Type: application/json\nX-TechAtlas-Signature: '+(scenario===2?'invalid-fixture':'valid-fixture')+'\n\n'+JSON.stringify({id:'evt-1',type:'order.created',note:p.message})});
  if(scenario===2)add('ตรวจ Signature ไม่ผ่าน','Lab กำหนดผลการตรวจ signature ไม่ทำ HMAC จริง จึงไม่รับ event และไม่ทำงาน',[['HTTP in mock',403],['Processed',0]],[move('receiver','source','403 rejected')],{status:'blocked',...response({accepted:false}),nodeUpdates:{work:'processed = 0'}});
  else{add('ตรวจแล้วบันทึก ID ก่อนรับงาน','สมมติบันทึก ID กับงานแบบ atomic เพื่อลดผลซ้ำ นโยบายจริงขึ้นกับ backend',[['Signature','valid (fixture)'],['Processed',1]],[move('receiver','work','รับ evt-1 ครั้งแรก')],{nodeUpdates:{work:'processed = 1'}});
   add(scenario===1?'ACK หายก่อนถึง Producer':'ตอบรับ Delivery','ตอบรับไม่จำเป็นต้องหมายถึงงานปลายทางเสร็จทั้งหมด',[['HTTP in mock',202],['Producer received ACK',scenario===0]],[move('receiver','source',scenario===0?'202 Accepted':'202 ACK สูญหายก่อนถึง Producer')],{...(scenario===0?response({accepted:true}):{}),status:scenario===1?'blocked':'ok',nodeUpdates:{work:'processed = 1'}});
   if(scenario===1){add('Producer Retry ID เดิม','ไม่ได้รับ ACK จึงส่งซ้ำตาม policy สมมติ ไม่ใช่มาตรฐาน retry ของทุก provider เช่น GitHub ไม่ redeliver failed delivery อัตโนมัติ',[['Event ID','evt-1']],[move('source','receiver','POST retry · evt-1')],{nodeUpdates:{work:'processed = 1'}});add('Receiver พบ ID เดิม → ไม่ทำงานซ้ำ','การตอบรับซ้ำไม่เพิ่มจำนวน processed',[['Processed',1],['Duplicate',true]],[move('receiver','source','202 · duplicate accepted')],{...response({accepted:true,duplicate:true}),nodeUpdates:{work:'processed = 1'}});}}
 }else{
  node('client','Client',kind==='websocket'?'ยังไม่เปิดช่อง':'ยังไม่ส่งคำขอ',[-4,1],true);node('server','Service',kind==='websocket'?'ช่องยังไม่เปิด':'event log: 1, 2',[4,1]);link('client','server');
  if(kind==='websocket'){
   add('HTTP Upgrade handshake','Lab เลือก classic HTTP/1.1 ไม่จำลองกลไก handshake ทุกรูปแบบ',[['Request','Upgrade: websocket']],[move('client','server','GET /chat · Upgrade')],{request:'GET /chat HTTP/1.1\nUpgrade: websocket\nConnection: Upgrade\n(ย่อ key/version headers)'});
   if(scenario===1)add('ไม่เปิด WebSocket','policy ของบริการจำลองไม่อนุญาต จึงยังไม่มีช่อง message',[['HTTP',403]],[move('server','client','403 Forbidden')],{status:'blocked',...response('Handshake rejected')});
   else{add('101 → ช่องเปิด','ข้อความถัดไปเป็น WebSocket messages ไม่ใช่ HTTP responses',[['HTTP',101],['Channel','OPEN']],[move('server','client','101 Switching Protocols')],{responseHead:'HTTP/1.1 101 Switching Protocols\nUpgrade: websocket\nConnection: Upgrade\n(ย่อ Sec-WebSocket-Accept)',nodeUpdates:{client:'OPEN',server:'OPEN'}});add('Client ส่ง Message','ส่งข้อความตาม application protocol สมมติ',[['Message',p.message]],[move('client','server','WS: '+p.message)],{sentMessage:'WebSocket message: '+p.message});if(scenario===2)add('Connection ขาดก่อนคำตอบ','ยังยืนยันไม่ได้ว่า application ปลายทางทำงานเสร็จหรือไม่',[['Channel','DISCONNECTED'],['App reply received',false]],[],{status:'blocked',nodeUpdates:{client:'DISCONNECTED',server:'สถานะปลายทางยังไม่ทราบ'}});else{add('Server ตอบ Message','ใช้ช่องเดิม ไม่มี GET ใหม่',[['Channel','OPEN']],[move('server','client','WS: รับข้อความแล้ว')],response('รับข้อความแล้ว'));add('Server ส่ง Event เอง','ไม่ต้องรอ request ใหม่ก่อนส่ง update หลังช่องเปิด',[['Channel','OPEN']],[move('server','client','WS: ผู้ใช้อีกคนเข้าห้อง')],response('ผู้ใช้อีกคนเข้าห้อง'));}}
  }else if(kind==='sse'){
   add('Client เปิด EventSource','HTTP Request เริ่ม stream; ส่ง event data กลับทาง Server→Client',[['Accept','text/event-stream']],[move('client','server',scenario===1?'GET /events · Last-Event-ID: 1':'GET /events')],{request:scenario===1?'GET /events\nLast-Event-ID: 1':'GET /events'});
   add('Response Stream เปิด','HTTP200ครั้งเดียว แล้วตามด้วย event blocks ไม่ได้สร้าง response ใหม่ทุก block',[['Content-Type','text/event-stream'],['Response','OPEN']],[move('server','client','200 · event stream')],{responseHead:'HTTP 200 OK\nContent-Type: text/event-stream\n(stream ยังเปิดอยู่)',nodeUpdates:{client:'รับ Events',server:'stream OPEN'}});
   if(scenario===2)add('ไม่ส่งข้อความย้อนใน SSE Stream','Client ต้องส่งคำสั่งผ่าน request อีกเส้นทาง ไม่แต่ง message ที่ SSE ส่งกลับไม่ได้',[['Client→Server via same stream','Not supported']],[],{status:'blocked',active:['client']});
   else for(const id of(scenario===1?[2]:[1,2]))add('Server Event '+id,'สมมติ service เก็บ history และ replay หลัง last ID ที่ให้มา ไม่มีคำรับประกันว่าทุก service replay ได้',[['Event ID',id],['Response','OPEN']],[move('server','client','SSE id '+id)],{...response(`id: ${id}\ndata: ${JSON.stringify({message:p.message,event:id})}\n\n`),nodeUpdates:{client:'last ID = '+id,server:'stream ยัง OPEN'}});
  }else if(kind==='long-polling'){
   add('Client ขอหลัง Cursor 0','Server ยังไม่ตอบทันทีเมื่อยังไม่มีข้อมูล',[['Cursor',0]],[move('client','server','GET /events?after=0')],{request:'GET /events?after=0'});add('ถือ Request รอ','ไม่มี HTTP response ระหว่างรอ ภาพเวลาเป็นขั้นเหตุการณ์ ไม่ใช่ latency จริง',[['HTTP response','ยังไม่มี'],['Request','PENDING']],[],{nodeUpdates:{server:'request PENDING'}});
   if(scenario===2)add('Client Disconnect','ไม่แสดงว่าผู้เรียนได้รับ response ทั้งที่ channel ขาด',[['Received response',false]],[],{status:'blocked',nodeUpdates:{client:'DISCONNECTED'}});
   else{add(scenario===1?'ครบเวลารอ → ตอบ 204':'Event มา → ตอบ 200','หนึ่ง response จบแล้ว ต้องเริ่ม request ใหม่ แม้ TCP connection อาจถูก reuse',[['HTTP',scenario===1?204:200],['Response','ENDED']],[move('server','client',scenario===1?'204 No Content':'200 · event 1')],{...response(scenario===1?'(ไม่มี response body)':{event:1,note:p.message}),nodeUpdates:{client:scenario===1?'cursor = 0':'cursor = 1',server:'response ENDED'}});add('Client เริ่ม Request รอบถัดไป','เปลี่ยน cursor หลัง event ที่รับแล้ว; 204 ไม่เลื่อน cursor เพราะไม่มี event ใหม่',[['Cursor',scenario===1?0:1],['New request','PENDING']],[move('client','server',`GET /events?after=${scenario===1?0:1}`)],{request:`GET /events?after=${scenario===1?0:1}`,nodeUpdates:{server:'request ใหม่ PENDING',client:scenario===1?'cursor = 0':'cursor = 1'}});}
  }else throw Error('รูปแบบ API ไม่รองรับ');
 }
 // API frames preserve the state already established (OPEN, cursor, processed count).
 let states={};for(const frame of steps){states={...states,...frame.nodeUpdates};frame.nodeUpdates={...states};}
 const model={id:lesson.id,kind,title:lesson.title,nodes,links,steps,mode:'3d',parameters:p,scenario};
 for(const frame of steps)if(['basics','rest'].includes(kind)&&frame.response!==undefined){const fields=Object.fromEntries(frame.fields);frame.responseHead='HTTP '+fields.HTTP+'\nContent-Type: application/json'+(fields.Allow&&fields.Allow!=='—'?'\nAllow: '+fields.Allow:'')+(fields.Location&&fields.Location!=='—'?'\nLocation: '+fields.Location:'');}
 steps.forEach((frame,i)=>frame.visual=apiVisual(model,i));
 return model;
}
