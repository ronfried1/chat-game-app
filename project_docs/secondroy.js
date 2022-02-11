
//client code

const socketContext =createContext();



const ProvideSocket = ({ children }) => {

  const socket = useSocket();

  
return (

    <socketContext.Provider value={socket}>
        {children}
        </socketContext.Provider>

  );

};

const useSocket = () => {

  const [socket,setSocket]= useState();

  //state that changes by client

  const [foo,setFoo]= useState();

  const [bar,setBar]= useState();

  //state that changes by server

  const [serverState,setServerState]= useState();



  const connect = () => {

    const url = process.env.SocketUrl|| 'url';

    const socket = io.connect(url);

    socket.on('connect',() => {

      // all of your .on listeners

      socket.on('foo',(val)=> setFoo(val));

      socket.on('bar',(val)=> setBar(val));

      socket.on('serverEmit',(val)=> setServerState(val));

    });

    setSocket(socket);

  };

  const emitBar = (val)=> {

    socket.emit('bar', val);

  };

  const emitFoo = (val)=> {

    socket.emit('foo', val);

  };

  return { connect, emitBar, emitFoo, foo, bar, serverState };

};

const useSocketIo = () => {

  
return useContext(socketContext);

};



// server code

const app = express();

const httpServer = createServer(app);

const io = newServer(httpServer,{

  cors: { origin: '*'},

});

// initial connection

io.on(Event.CONNECT,(socket)=> {

  socket.on('foo',(_)=> io.emit('serverEmit',`user${socket.id} did foo`));

  socket.on('bar',(_)=> io.emit('serverEmit',`user ${socket.id} did bar`));

});
