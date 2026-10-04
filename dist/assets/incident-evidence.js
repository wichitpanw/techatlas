// Evidence requirements belong to bounded fixtures, not diagnosis of real networks.
export const incidentRequirements=[['link','ip'],['ping','dns'],['dns','tcp']];
export function incidentReady(caseIndex,commands){
  return incidentRequirements[caseIndex].every(command=>commands.includes(command));
}
export const incidentPrompts=[
 'เครื่องลูกค้าเข้าเว็บไม่ได้ เริ่มตรวจสถานะ link และค่าที่ตั้งไว้ ก่อนเลือกสิ่งที่จะตรวจต่อ',
 'เข้าเว็บด้วยชื่อไม่ได้ เปรียบเทียบการเข้าถึง IP กับการค้นชื่อ ก่อนสรุปว่าต้องตรวจด้านใด',
 'เปิดบริการไม่ได้ ตรวจการค้นชื่อและการตอบ TCP แล้วแยก DNS ออกจาก service/policy',
];
