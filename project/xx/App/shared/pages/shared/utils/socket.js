import io from 'socket.io-client';
import { socketServer } from '../../../../../config';

// 用来连接服务器的socket.io服务
export function createSocketIO (userId) {
    const socket = io.connect(`${socketServer}?userId=${userId}&platform=1`, { path: '/hb/api/socket' });
    socket.on('connect', obj => {
        console.log('connect to server');
    }).on('disconnect', obj => {
        console.log('disconnect to server');
    }).on('connect_error', obj => {
        console.error('connect to server error');
    }).on('connect_timeout', obj => {
        console.error('connect to server timeout');
    }).on('reconnect', obj => {
        console.log('reconnect to server');
    }).on('reconnect_failed', obj => {
        console.error('reconnect to server failed');
    });
    return socket;
}
