import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const VideoCall = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Retrieve User Info from your Auth system
  const userName = localStorage.getItem("user_name") || "User";
  const userId = localStorage.getItem("user_id") || `user_${Date.now()}`;

  const myMeeting = async (element) => {
    // --- 1. Get these from ZegoCloud Console (https://console.zegocloud.com/) ---
    // Create a project -> Select "Video Conference" -> Get AppID & ServerSecret
    const appID = 1951322333; // Replace with your AppID (number)
    const serverSecret = "d82d18017736260d35e6f16086d6b303"; // Replace with your ServerSecret (string)
    // -------------------------------------------------------------------------

    if (appID === 0) {
      alert(
        "Please configure your ZegoCloud AppID and ServerSecret in src/pages/VideoCall.jsx",
      );
      return;
    }

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      roomId,
      userId,
      userName,
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: element,
      sharedLinks: [
        {
          name: "Personal link",
          url:
            window.location.protocol +
            "//" +
            window.location.host +
            window.location.pathname +
            "?roomID=" +
            roomId,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall, // 1-on-1 calls for doctor/patient
      },
      showScreenSharingButton: true,
      onLeaveRoom: () => navigate(-1), // Go back to dashboard when call ends
    });
  };

  return (
    <div
      className="myCallContainer"
      ref={myMeeting}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default VideoCall;
