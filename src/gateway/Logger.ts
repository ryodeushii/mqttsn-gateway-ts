
import * as bunyan from 'bunyan';

export const log = bunyan.createLogger({ 
  name: 'mqttsn-gateway',
  level: 'trace'
});
