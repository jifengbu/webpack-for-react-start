import request from 'superagent';

export default function doRequest (url, data, root) {
    return new Promise((resolve, reject) => {
        if (root && root.user) {
            Object.assign(data, { userId: root.user.userId, token: root.user.token, platform: 1 });
        } else {
            Object.assign(data, { platform: 1 });
        }
        console.log('send[' + url + ']:', data);
        const req = request
        .post(url)
        .set({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        })
        .send(data);

        req.end((error, res) => {
            if (error) {
                console.error('recv error[' + url + ']:', error);
                resolve();
            } else {
                const body = res.body;
                console.log('recv[' + url + ']:', body);
                if (body && body.invalidToken) {
                    return reject({ message: `invalidToken#${body.msg}` });
                }
                resolve(body);
            }
        });
    });
}
