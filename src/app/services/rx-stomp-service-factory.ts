import { RxStompConfig } from '@stomp/rx-stomp';
import * as SockJS from "sockjs-client";
import { RxStompService } from './rx-stomp.service';

console.log(sessionStorage.getItem("token"))

const myRxStompConfig: RxStompConfig = {
  // Which server?
  webSocketFactory: () => new SockJS("http://localhost:8087/kafka"),

  // Headers
  connectHeaders: {
      token: sessionStorage.getItem("token"),
  },

  // How often to heartbeat?
  // Interval in milliseconds, set to 0 to disable
  // heartbeatIncoming: 0, // Typical value 0 - disabled
  // heartbeatOutgoing: 20000, // Typical value 20000 - every 20 seconds

  // Wait in milliseconds before attempting auto reconnect
  // Set to 0 to disable
  // Typical value 500 (500 milli seconds)
  reconnectDelay: 20000,

  // Will log diagnostics on console
  // It can be quite verbose, not recommended in production
  // Skip this key to stop logging to console
  debug: (msg: string): void => {
      // console.log(new Date(), msg);
  },
};

export function rxStompServiceFactory() {
  const rxStomp = new RxStompService();
  rxStomp.configure(myRxStompConfig);
  rxStomp.activate();
  return rxStomp;
}