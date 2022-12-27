import { WebSocketServer, Data, WebSocket } from "ws";

import { Server } from "http";
import {
  AuthMessageContent,
  authMain,
  Message,
  registerWatcher,
  sendData,
  RegisterWatcherMessageContent, SendDataMessageContent
} from "./ws/messageHandlers";

const onMessage = (ws: WebSocket) =>  (message: Data) =>  {
  const { type, data } = JSON.parse(message.toString()) as Message;

  switch (type) {
    case 'main:auth':
      authMain(data as AuthMessageContent, ws);
      break;
    case 'main:send-data':
      sendData(data as SendDataMessageContent, ws);
      break;
    case 'watcher:register':
      console.log(data);
      registerWatcher(data as RegisterWatcherMessageContent, ws);
      break;
  }
}

function onConnection(ws: WebSocket) {
  ws.on('message', onMessage(ws));
}

export = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', onConnection);
}