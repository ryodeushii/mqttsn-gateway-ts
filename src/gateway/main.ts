
import { TCPTransport } from './TCPTransport';
import { GatewayDB } from './GatewayDB';
import { Forwarder } from './Forwarder';
import { Gateway } from './Gateway';
import { log } from './Logger';
import { TransportInterface } from './interfaces';


log.level('error');

// Select Forwarder transport
let transport: TransportInterface;

  let tcpPort = 1883;
  if(isNaN(tcpPort)) tcpPort = 6969;
  transport = new TCPTransport(tcpPort);


let db = new GatewayDB("/tmp/gateway.db");
let gw: Gateway;

db.connect()
.then(() => {
  let forwarder = new Forwarder(db, transport, 1);
  gw = new Gateway(db, forwarder);
  return gw.init("rmq-url-with-mqtt-plugin", true);
})
.then(() => {
  // let gwMon = new GwMonitor(gw, program.monitorPrefix); // FIXME: wtf?
  log.info("Gateway Started");
});


