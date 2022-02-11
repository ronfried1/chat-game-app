
const socketContext = createContext();



const ProvideSocket= ({ children }) => {

  const socket= useSocket();

  return (

    <socketContext.Provider
    value={socket}>
        {children}
        </socketContext.Provider>

     );

};

const useSocket= () => {

  const [socket,setSocket]= useState();

  const connect= () => {

    const url = process.env.SocketUrl|| 'url';

    const socket = io.connect(url);

    socket.on('connect',() => {

      // all of your .on listeners

    });

    setSocket(socket);

  };

  const emitBar= (val)=> {

    socket.emit('bar', val);

  };

  const emitFoo= (val)=> {

    socket.emit('foo', val);

  };

  return { connect, emitBar, emitFoo};

};

const useSocketIo= () => {

  return useContext(socketContext);

};
