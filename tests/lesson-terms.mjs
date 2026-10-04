import assert from 'node:assert/strict';
import {glossaryEntries,termsForLesson,lessonTermsSurface,searchGlossary} from '../dist/assets/lesson-terms.js';
import {arrangeNetwork} from '../dist/assets/network-foundations.js';
import {networkLessons} from '../dist/assets/network-curriculum.js';
import {pythonLessons} from '../dist/assets/python-curriculum.js';
assert(glossaryEntries.length>150);
assert.deepEqual(searchGlossary(glossaryEntries.map(e=>[e.name,e.meaning]),'ACK').map(row=>row[0]),['TCP ACK','ACK','DHCP ACK']);
const dhcp=termsForLesson({track:'network',title:'DHCP',explain:'DISCOVER OFFER REQUEST ACK NAK Lease'});
assert.deepEqual(dhcp.filter(e=>e.name.startsWith('DHCP ')).map(e=>e.name),['DHCP DISCOVER','DHCP OFFER','DHCP REQUEST','DHCP ACK','DHCP NAK']);
assert(!dhcp.some(e=>e.name==='TCP ACK'));
assert(termsForLesson({track:'network',title:'TCP SYN ACK'}).some(e=>e.name==='TCP ACK'));
const all=[...arrangeNetwork(networkLessons),...pythonLessons];
for(const l of all){const entries=termsForLesson(l);assert(entries.length>0,l.id+' missing terms');assert(entries.every(e=>e.track===l.track));assert(lessonTermsSurface(l).includes('ตามลำดับที่พบ'));}
console.log(`PASS ${glossaryEntries.length} definitions; ${all.length} lesson panels; DHCP/TCP ACK contextual matching`);
