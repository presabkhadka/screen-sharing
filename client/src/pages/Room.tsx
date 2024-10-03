import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { RoomContext } from "../context/RoomContext";
import { VideoPlayer } from "../components/VideoPlayer";
import { ShareScreenButton } from "../components/ShareScreenButton";
import { ChatButton } from "../components/ChatButton";
import { Chat } from "../components/chat/Chat";
import { PeerState } from "../reducers/peerReducer";
import { NameInput } from "../common/Name";

export const Room = () => {
  const { id } = useParams();
  const {
    ws,
    me,
    userName,
    stream,
    peers,
    shareScreen,
    screenSharingId,
    setRoomId,
    toggleChat,
    chat,
  } = useContext(RoomContext);

  useEffect(() => {
    if (me && stream)
      ws.emit("join-room", { roomId: id, peerId: me._id, userName });
  }, [id, me, ws, stream]);

  useEffect(() => {
    setRoomId(id);
  }, [id, setRoomId]);

  console.log({ screenSharingId });

  const screenSharingVideo =
    screenSharingId === me?.id ? stream : peers[screenSharingId]?.stream;

  const { [screenSharingId]: sharing, ...peersToShow } = peers;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-blue-500 p-4 text-white">Room id :- {id}</div>
      <div className="flex grow">
        {screenSharingVideo && (
          <div className="w-4/5 pr-4">
            <VideoPlayer stream={screenSharingVideo} />
          </div>
        )}
        <div
          className={`grid  gap-4 ${
            screenSharingVideo ? "w-1/5 grid-cols-1" : "grid-cols-4"
          }`}
        >
          {screenSharingId !== me?.id && (
            <div>
              <VideoPlayer stream={stream} />
              {/* name change garne bhaye */}
              {/* <NameInput /> */}
            </div>
          )}

          {Object.values(peersToShow as PeerState)
            .filter((peer) => !!peer.stream)
            .map((peer) => (
              <div>
                <VideoPlayer stream={peer.stream} />
                <div>{peer.userName}</div>
              </div>
            ))}
        </div>
        {chat.isChatOpen && (
          <div className="border-l-2 pb-24 ">
            <Chat />
          </div>
        )}
      </div>
      <div className="h-24 fixed bottom-0 p-4 w-full flex justify-center items-center border-t-2 bg-white gap-2">
        <ShareScreenButton onClick={shareScreen} />
        <ChatButton onClick={toggleChat} />
      </div>
    </div>
  );
};
