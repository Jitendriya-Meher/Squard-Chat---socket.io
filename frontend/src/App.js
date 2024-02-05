import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import 'react-toastify/dist/ReactToastify.css';
import { toast } from "react-toastify";

const socket = io("http://localhost:4000");

function App() {

  // const socket = useMemo(
  //   () =>
  //     io.connect("http://localhost:4000"),
  //   []
  // );

  const [userName, setUserName] = useState("");
  const [chatActive, setChatActive] = useState(false);
  const [oldMessages, setOldMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  function handleSubmit(e){
    e.preventDefault();

    if( newMessage.trim().length === 0){
      toast.error(`Please enter a valid message ${userName}`);
      return;
    }

    const messageData = {
      message : newMessage,
      user : userName,
      time : new Date( Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes()
    }
    setNewMessage("");
    console.log("message: " , messageData);
    socket.emit("send-message", messageData);
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    socket.on("received-message", (message) => {
      setOldMessages([...oldMessages,message]);
    });
    scrollToBottom();
  },[socket,oldMessages]);

  return (
    <div className=" w-screen h-screen bg-gray-300 flex justify-center items-center">
      
      {
        chatActive ? ( 
          <div className=" rounded-md w-full md:w[80vw] lg:w-[50vw] mx-auto flex flex-col justify-center">
            
            <h1 className=" text-center font-bold text-xl my-2 uppercase">
              Squard Chat
            </h1>
            <div className=" pb-4">
              <div className=" overflow-y-auto h-[80vh] md:h-[70vh] lg:h-[60vh] px-4">

              {
                oldMessages.map((message,index) => (
                  <div className={`flex shadow-md my-5 w-fit ${userName===message.user ? "ml-auto flex-row-reverse":""}`} key={index}>
                    <div className={` bg-green-400 flex justify-center items-center rounded-md`}>
                      <h3 className=" font-bold text-lg px-2">
                        {
                          message.user.charAt(0).toUpperCase()
                        }
                      </h3>
                    </div>
                    <div className=" px-2 bg-white rounded-md">
                      <span className=" text-sm">
                        {
                          message.user
                        }
                      </span>
                      <h3 className=" font-bold">
                        {
                          message.message
                        }
                      </h3>
                      <h3 className=" text-xs text-right mt-1">
                        {
                          message.time
                        }
                      </h3>
                    </div>
                  </div>
                ))
              }

              <div ref={messagesEndRef}></div>

              </div>
              <form className=" flex gap-2 md:gap-5 justify-between mt-4"
              onSubmit={handleSubmit}>

                <input type="text"
                placeholder="Type your message..."
                className=" rounded-md border-2 outline-none px-3 py-2 w-full"
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                }} />

                <button className=" bg-green-500 text-white px-3 py-2 rounded-md font-semibold" 
                type="submit">
                  Send
                </button>
              </form>

            </div>
          </div>
        ):(
          <div className=" w-screen flex h-screen justify-center items-center gap-5">
          
            <input type="text"
            className=" text-center px-3 py-2 outline-none border-2 rounded-md"
            placeholder="Enter your name here"
            value={userName}
            onChange={(e) => {
              setUserName(e.target.value);
            }} />

            <button className=" bg-green-500 text-white px-3 py-2 rounded-md"
            onClick={() => {
              if( userName.trim() === '') {
                toast.error("Please enter your name");
                return;
              }
              setChatActive(true);
              toast.success(`Welcome ! ${userName} to Squard Chat`);
            }}>
              Start Chat
            </button>

          </div>
        )
      }

    </div>
  );
}

export default App;
