declare module "*.svg" {
  import React = require("react");
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

interface ApiResponse<T> {
  data: T;
  message: string;
  sucess: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  message?: Message[];
}

export interface AuthPayload {
  accessToken: string;
  refreshToken: string;
}

export interface Message {
  id: string;
  content: string;
  sender: string;
  receiver: string;
  createdAt: string;
}
