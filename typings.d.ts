declare module "redux-offline-queue" {
  import { Middleware } from "redux";

  export const reducer: (state: any, action: any) => any;
  export const offlineMiddleware: (next: any) => (userConfig: any) => any;
  export const suspendSaga: (middlewar: Middleware) => any;
  export const consumeActionMiddleware: () => any;
  export const offlinePersistenceTransform: any;
  export const createOfflineActions: (config: any) => any;
  export const markActionsOffline: (creator: any, offlineActions: any) => void;
  export const queueAction: (action: any) => any;
  export const removeAction: (action: any) => any;

  export const ONLINE: string;
  export const OFFLINE: string;
}
