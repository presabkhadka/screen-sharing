import { IMessage } from "../type/chat";
import { ADD_MESSAGE, ADD_HISTORY, TOGGLE_CHAT } from "./chatActions";

export type ChatState = {
  messages: IMessage[];
  isChatOpen: boolean;
};
type ChatAction =
  | {
      type: typeof ADD_MESSAGE;
      payload: { message: IMessage };
    }
  | {
      type: typeof ADD_HISTORY;
      payload: { history: IMessage[] };
    }
  | {
      type: typeof TOGGLE_CHAT;
      payload: { isOpen: boolean };
    };

export const chatReducer = (
  state: ChatState = { messages: [], isChatOpen: false },
  action: ChatAction
) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return {
        ...state,
        messages: Array.isArray(state.messages)
          ? [...state.messages, action.payload.message]
          : [action.payload.message], // Ensure messages is an array
      };
    case ADD_HISTORY:
      return {
        ...state,
        messages: Array.isArray(action.payload.history)
          ? action.payload.history
          : [], // Ensure history is an array
      };
    case TOGGLE_CHAT:
      return {
        ...state,
        isChatOpen: action.payload.isOpen,
      };
    default:
      return state;
  }
};
