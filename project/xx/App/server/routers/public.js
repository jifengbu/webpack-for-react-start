import { Router } from 'express';
import request from 'request';
import { urls } from 'helpers/api';

const publicRouter = new Router();

publicRouter.post('/hb/api/uploadFile', (req, res) => {
    req.pipe(request(urls.uploadFile)).pipe(res);
});

publicRouter.post('/hb/api/member/uploadMemberExcel', (req, res) => {
    req.pipe(request(urls.uploadMemberExcel)).pipe(res);
});

publicRouter.post('/hb/api/member/uploadOrganizationExcel', (req, res) => {
    req.pipe(request(urls.uploadOrganizationExcel)).pipe(res);
});

publicRouter.post('/hb/api/member/uploadRoleExcel', (req, res) => {
    req.pipe(request(urls.uploadRoleExcel)).pipe(res);
});

publicRouter.post('/hb/api/member/uploadPeopleExcel', (req, res) => {
    req.pipe(request(urls.uploadPeopleExcel)).pipe(res);
});

export default publicRouter;
