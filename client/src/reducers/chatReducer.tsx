import { IMessage } from "../type/chat";
import { ADD_MESSAGE, ADD_HISTORY } from "./chatActions";

export type ChatState = {
    messages: IMessage[];
    isChatOpen: boolean;
};
type ChatAction =
  | {
      type: typeof ADD_MESSAGE;
      payload: { message: IMessage};
    }
  | {
      type: typeof ADD_HISTORY;
      payload: { history: IMessage[]};
    };

export const chatReducer = (state: ChatState, action: ChatAction) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
       messages: [...state.messages, action.payload.message]
      };
    case ADD_HISTORY:
      return {
       ...state,
        messages: action.payload.history,
      }

    default:
      return { ...state };
  }
};
