import { verify } from "jsonwebtoken";
import WebSocket from "ws";
import { createClient } from "redis";

const watchers: { [id: string]: WebSocket[] } = {};

const publisher = createClient({
  socket: {
    host: 'localhost',
    port: 6379
  },
});

const subscriber = publisher.duplicate();

async function run(){
  await publisher.connect();
  await subscriber.connect();

  await subscriber.subscribe('livedata', msg => {
    const msgParsed = JSON.parse(msg);
    const watchersList = watchers[msgParsed.id];

    if(watchersList) {
      watchersList.forEach(ws => {
        ws.send(JSON.stringify({randomData: msgParsed.randomData}))
      });
    }
  });
}

run().catch(err => console.log(err))

export interface Message<T = any> {
  type: 'main:auth' | 'main:send-data' | 'watcher:register';
  data: T;
}

export interface AuthMessageContent {
  token: string;
}

export interface RegisterWatcherMessageContent {
  id: string;
}

export interface SendDataMessageContent {
  id: string;
  randomData: string;
}

export function authMain({ token }: AuthMessageContent, ws: WebSocket) {
  if(!process.env.ACCESS_TOKEN_SECRET) {
    ws.terminate();
    return;
  }
  verify(token, process.env.ACCESS_TOKEN_SECRET, err => {
    if(err) {
      console.log('Error: ', err);
      ws.terminate();
      return;
    }
    ws.send('Auth succeeded');
  });
}

export function registerWatcher({ id }: RegisterWatcherMessageContent, ws: WebSocket) {
  if(!watchers[id]){
    watchers[id] = [];
  }
  watchers[id].push(ws);
}

export function sendData({ randomData, id }: SendDataMessageContent, ws: WebSocket) {
  publisher.publish('livedata', JSON.stringify({ randomData, id }));
}
