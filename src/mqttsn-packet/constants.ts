/* Protocol - protocol constants */
export const types: Record<number, string> = {
  0: 'advertise',
  1: 'searchgw',
  2: 'gwinfo',
  3: 'reserved',
  4: 'connect',
  5: 'connack',
  6: 'willtopicreq',
  7: 'willtopic',
  8: 'willmsgreq',
  9: 'willmsg',
  10: 'register',
  11: 'regack',
  12: 'publish',
  13: 'puback',
  14: 'pubcomp',
  15: 'pubrec',
  16: 'pubrel',
  17: 'reserved',
  18: 'subscribe',
  19: 'suback',
  20: 'unsubscribe',
  21: 'unsuback',
  22: 'pingreq',
  23: 'pingresp',
  24: 'disconnect',
  25: 'reserved',
  26: 'willtopicupd',
  27: 'willtopicresp',
  28: 'willmsgupd',
  29: 'willmsgresp',
  254: 'Encasulated message',
  255: 'reserved'
};

for (var i = 30; i < 254; i += 1) {
  types[i] = 'reserved';
}

export const return_types: Record<number, string> = {
  0: 'Accepted',
  1: 'Rejected: congestion',
  2: 'Rejected: invalid topic ID',
  3: 'Rejected: not supported'
};

for (var i = 4; i < 256; i += 1) {
  return_types[i] = 'reserved';
}

/* Mnemonic => Command code */
/* jshint forin:false : there is no unwanted prototype here */
export const codes: Record<string, string> = {};
for (var k in types) {
  var v = types[k];
  codes[v] = k;
}

export const return_codes: Record<string, string> = {};
for (var k in return_types) {
  var v = return_types[k];
 return_codes[v] = k;
}
/* jshint forin:true */

export const topicIdCodes = {
  normal: 0,
  'pre-defined': 1,
  'short topic': 2
};

export const DUP_MASK = 0x80;
export const QOS_MASK = 0x60;
export const QOS_SHIFT = 5;
export const RETAIN_MASK = 0x10;
export const WILL_MASK = 0x08;
export const CLEAN_MASK = 0x04;
export const TOPICIDTYPE_MASK = 0x03;

export const ID = 0x01;

export const RADIUS_MASK = 0x03;