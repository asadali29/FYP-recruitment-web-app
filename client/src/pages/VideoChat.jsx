import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";

const VideoChat = () => {
  const { jobId, candidateId } = useParams(); // Extracting jobId and candidateId from the URL
  const [socket, setSocket] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [isCompany, setIsCompany] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [interviewEnded, setInterviewEnded] = useState(false);
  // const socketRef = useRef(null);

  const servers = {
    iceServers: [
      {
        urls: "stun:stun.l.google.com:19302",
      },
    ],
  };

  // Effect to request media permissions
  useEffect(() => {
    const requestMediaPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        setPermissionsGranted(true);
        console.log("Media permissions granted.");
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    requestMediaPermissions();
  }, []);

  useEffect(() => {
    if (!permissionsGranted) return; // Wait for permissions to be granted

    // const newSocket = io.connect("http://localhost:3001");
    // setSocket(newSocket);
    const newSocket = io("http://localhost:3001", {
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    });

    // if (!socketRef.current) {
    //   // socketRef.current = io.connect("http://localhost:3001");
    //   socketRef.current = io("http://localhost:3001", {
    //     reconnectionAttempts: 5,
    //     reconnectionDelay: 2000,
    //   });
    // }

    const pc = new RTCPeerConnection(servers);
    setPeerConnection(pc);

    // Extract role from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const role = queryParams.get("role");
    setIsCompany(role === "company");

    console.log("Role extracted from query params: ", role);

    // Join room with the roomId as candidateId or jobId
    const roomId = `${jobId}-${candidateId}`;
    console.log("Joining room: ", roomId);
    newSocket.emit("join-room", { roomId, userType: role });
    // socketRef.current.emit("join-room", { roomId, userType: role });

    // ICE Candidate handling
    pc.onicecandidate = (event) => {
      // peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        newSocket.emit("ice-candidate", {
          // socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    };

    // When a remote stream is added, display it in the remote video element
    pc.ontrack = (event) => {
      // peerConnection.ontrack = (event) => {
      console.log("Remote stream received:", event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
        console.log(
          "Remote video element updated with stream:",
          event.streams[0]
        );
      } else {
        console.log("Remote video element not found");
      }
    };

    // socketRef.current.on("connect", () => {
    //   console.log("Socket connected: ", socketRef.current.id);
    // });
    newSocket.on("connect", () => {
      console.log("Socket connected: ", newSocket.id);
    });

    // socketRef.current.on("disconnect", (reason) => {
    //   console.log("Socket disconnected: ", reason);
    // });
    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected: ", reason);
    });

    // Handle incoming offers
    newSocket.on("offer", async (offer) => {
      // socketRef.current.on("offer", async (offer) => {
      console.log("Received offer: ", offer);
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      // await peerConnection.setRemoteDescription(
      //   new RTCSessionDescription(offer)
      // );
      const answer = await pc.createAnswer();
      // const answer = await peerConnection.createAnswer();
      await pc.setLocalDescription(answer);
      // await peerConnection.setLocalDescription(answer);
      newSocket.emit("answer", { roomId, answer });
      // socketRef.current.emit("answer", { roomId, answer });
    });

    // Handle incoming answers
    newSocket.on("answer", async (answer) => {
      // socketRef.current.on("answer", async (answer) => {
      console.log("Received answer: ", answer);
      await pc.setRemoteDescription(new RTCSessionDescription(answer));
      // await peerConnection.setRemoteDescription(
      //   new RTCSessionDescription(answer)
      // );
    });

    // Handle incoming ICE candidates
    newSocket.on("ice-candidate", async (candidate) => {
      // socketRef.current.on("ice-candidate", async (candidate) => {
      console.log("Received ICE candidate: ", candidate);
      try {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
        // await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("Error adding received ICE candidate", err);
      }
    });

    // Start the video chat if the company has already started it
    newSocket.on("company-started-interview", () => {
      // socketRef.current.on("company-started-interview", () => {
      console.log("Company started the interview");
      setInterviewStarted(true);
    });

    newSocket.on("end-interview", () => {
      setInterviewEnded(true);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      // if (peerConnection) {
      //   peerConnection.close();
      // }
      if (pc) {
        pc.close();
      }
      newSocket.disconnect();
    });

    // If the company, initiate the start interview process
    if (role === "company") {
      newSocket.emit("start-interview", { roomId });
      // socketRef.current.emit("start-interview", { roomId });
    }

    // Get local media stream and add it to the peer connection
    const startVideoChat = async () => {
      try {
        if (localStream) {
          localVideoRef.current.srcObject = localStream;
          console.log("Local video element updated with stream:", localStream);
          localStream
            .getTracks()
            .forEach((track) => pc.addTrack(track, localStream));
          // .forEach((track) => peerConnection.addTrack(track, localStream));

          // Only the company initiates the offer
          if (role === "company" && interviewStarted) {
            const offer = await pc.createOffer();
            // const offer = await peerConnection.createOffer();
            await pc.setLocalDescription(offer);
            // await peerConnection.setLocalDescription(offer);
            newSocket.emit("offer", { roomId, offer });
            // socketRef.current.emit("offer", { roomId, offer });
          }
        }
      } catch (err) {
        console.error("Error accessing media devices.", err);
      }
    };

    if (interviewStarted) {
      startVideoChat();
    }

    setSocket(newSocket);

    // Cleanup function to stop media tracks and close connections
    return () => {
      if (pc) pc.close();

      if (newSocket) newSocket.disconnect();

      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
        setLocalStream(null);
      }
    };
    // }, [jobId, candidateId, interviewStarted]);
  }, [permissionsGranted, localStream, interviewStarted]);
  // }, [permissionsGranted, localStream]);
  // }, [permissionsGranted]);

  const handleEndInterview = () => {
    const roomId = `${jobId}-${candidateId}`;
    if (socket) {
      socket.emit("end-interview", { roomId });
    }
    setInterviewEnded(true);
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection) {
      peerConnection.close();
    }
  };

  return (
    // <div>
    //   <h2>Video Interview</h2>
    //   {!interviewStarted && !isCompany && (
    //     <p style={{ marginTop: "1em" }}>
    //       Waiting for the company to start the interview...
    //     </p>
    //   )}
    //   <video ref={localVideoRef} autoPlay muted />
    //   <video ref={remoteVideoRef} autoPlay />
    // </div>

    <div className="video-chat-container">
      <h2>
        <span>Video Interview</span>
      </h2>
      {interviewEnded ? (
        <p className="interview-ended-message">
          Thank you for attending the interview.
        </p>
      ) : (
        <>
          {!interviewStarted && !isCompany && (
            <p className="waiting-message">
              Waiting for the company to start the interview...
            </p>
          )}
          <div className="video-container">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              className="video-element"
            />
            <video ref={remoteVideoRef} autoPlay className="video-element" />
          </div>
          {isCompany && interviewStarted && (
            <button
              className="end-interview-button"
              onClick={handleEndInterview}
            >
              End Interview
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default VideoChat;

// ------------------------------------------------------

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import io from "socket.io-client";

// const VideoChat = () => {
//   const { jobId, candidateId } = useParams(); // Extracting jobId and candidateId from the URL
//   const [socket, setSocket] = useState(null);
//   const [peerConnection, setPeerConnection] = useState(null);
//   const localVideoRef = useRef(null);
//   const remoteVideoRef = useRef(null);
//   const [isCompany, setIsCompany] = useState(false);
//   const [interviewStarted, setInterviewStarted] = useState(false);

//   const servers = {
//     iceServers: [
//       {
//         urls: "stun:stun.l.google.com:19302",
//       },
//     ],
//   };

//   useEffect(() => {
//     // Check if socket and peerConnection are already set up
//     // if (!socket && !peerConnection) {
//     const newSocket = io.connect("http://localhost:3001"); // Replace with your backend server URL
//     setSocket(newSocket);

//     const pc = new RTCPeerConnection(servers);
//     setPeerConnection(pc);

//     // Extract role from the URL query parameters
//     // const queryParams = new URLSearchParams(location.search);
//     const queryParams = new URLSearchParams(window.location.search);
//     const role = queryParams.get("role");
//     setIsCompany(role === "company");

//     console.log("Role extracted from query params: ", role);

//     // Join room with the roomId as candidateId or jobId
//     const roomId = `${jobId}-${candidateId}`;
//     // newSocket.emit("join-room", { roomId });
//     console.log("Joining room: ", roomId);
//     newSocket.emit("join-room", { roomId, userType: role });

//     // ICE Candidate handling
//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         newSocket.emit("ice-candidate", {
//           roomId,
//           candidate: event.candidate,
//         });
//       }
//     };

//     // When a remote stream is added, display it in the remote video element
//     pc.ontrack = (event) => {
//       remoteVideoRef.current.srcObject = event.streams[0];
//     };

//     // Handle incoming offers
//     newSocket.on("offer", async (offer) => {
//       console.log("Received offer: ", offer);
//       if (!pc.currentRemoteDescription) {
//         await pc.setRemoteDescription(new RTCSessionDescription(offer));
//         const answer = await pc.createAnswer();
//         await pc.setLocalDescription(answer);
//         newSocket.emit("answer", { roomId, answer });
//       }
//     });

//     // Handle incoming answers
//     // newSocket.on("answer", async (answer) => {
//     //   console.log("Received answer: ", answer);
//     //   await pc.setRemoteDescription(new RTCSessionDescription(answer));
//     // });
//     newSocket.on("answer", async (answer) => {
//       try {
//         await pc.setRemoteDescription(new RTCSessionDescription(answer));
//       } catch (err) {
//         console.error("Failed to set remote description", err);
//       }
//     });

//     // Handle incoming ICE candidates
//     newSocket.on("ice-candidate", async (candidate) => {
//       console.log("Received ICE candidate: ", candidate);
//       try {
//         await pc.addIceCandidate(new RTCIceCandidate(candidate));
//       } catch (err) {
//         console.error("Error adding received ICE candidate", err);
//       }
//     });

//     // Start the video chat if the company has already started it
//     // newSocket.on("company-started-interview", () => {
//     //   console.log("Company started the interview");
//     //   setInterviewStarted(true);
//     //   // startVideoChat();
//     // });
//     newSocket.on("company-started-interview", async () => {
//       console.log("Company started the interview");
//       setInterviewStarted(true);
//       await startVideoChat();
//     });

//     // If the company, initiate the start interview process
//     if (role === "company") {
//       newSocket.emit("start-interview", { roomId });
//     }

//     // Get local media stream and add it to the peer connection
//     const startVideoChat = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({
//           video: true,
//           audio: true,
//         });
//         localVideoRef.current.srcObject = stream;
//         stream.getTracks().forEach((track) => pc.addTrack(track, stream));
//         // Only add tracks if the connection is open
//         // if (peerConnection && peerConnection.signalingState !== "closed") {
//         //   stream
//         //     .getTracks()
//         //     .forEach((track) => peerConnection.addTrack(track, stream));
//         // } else {
//         //   console.error("Cannot add track: RTCPeerConnection is closed.");
//         // }

//         if (role === "company") {
//           // if (isCompany) {
//           // Only the company initiates the offer
//           const offer = await pc.createOffer();
//           await pc.setLocalDescription(offer);
//           newSocket.emit("offer", { roomId, offer });
//         }
//       } catch (err) {
//         console.error("Error accessing media devices.", err);
//       }
//     };

//     // startVideoChat();
//     // Ensure startVideoChat is called only when needed
//     // if (interviewStarted) {
//     //   startVideoChat();
//     // }
//     // if (role === "candidate" && interviewStarted) {
//     //   startVideoChat();
//     // }
//     const initiateVideoChat = async () => {
//       if (
//         role === "candidate" &&
//         interviewStarted &&
//         peerConnection.signalingState !== "closed"
//       ) {
//         console.log(
//           "Starting video chat with signalingState: ",
//           peerConnection.signalingState
//         );
//         await startVideoChat();
//       }
//     };

//     initiateVideoChat();

//     return () => {
//       // if (pc) pc.close();
//       // if (peerConnection && peerConnection.signalingState !== "closed") {
//       //   peerConnection.close();
//       // }
//       // if (newSocket) newSocket.disconnect();
//       if (peerConnection) {
//         if (peerConnection.signalingState !== "closed") {
//           peerConnection.close();
//         }
//         setPeerConnection(null);
//       }
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//     };
//     // }
//     // }, [jobId, candidateId]);
//     // }, [jobId, candidateId, location.search]);
//   }, [jobId, candidateId, interviewStarted]);
//   // }, [interviewStarted, role]);

//   return (
//     <div>
//       <h2>Video Interview</h2>
//       <video ref={localVideoRef} autoPlay muted />
//       <video ref={remoteVideoRef} autoPlay />
//       {!interviewStarted && !isCompany && (
//         <p>Waiting for the company to start the interview...</p>
//       )}
//     </div>
//   );
// };

// export default VideoChat;
