import AuthNft, { GetTokenResponseSuccess } from 'authfa2';
import axios, { ResponseType } from 'axios';
import FormData from 'form-data';
import express from 'express';
import { UploadedFile } from 'express-fileupload';

import Controller from '../interfaces/controller.interface';

import authMiddleware from '../middleware/auth.middleware';
import {
  checkFile,
  checkParams,
  setupHeaders,
  cryptFileWithSalt,
} from "../utils";

class AuthenticationController implements Controller {
  public router = express.Router();
  public authnft = AuthNft();
  public _ = this.authnft.init({
    secret: process.env.JWT_SECRET ?? '',
    nftContractAddress: process.env.NFT_CONTRACT_ADDRESS ?? '',
  });

  public CHAINSAFE_BUCKET_URL = process.env.CHAINSAFE_BUCKET_URL ?? '';
  public CHAINSAFE_KEY_SECRET = process.env.CHAINSAFE_KEY_SECRET ?? '';
  public ENCRYPTION_KEY = process.env.ENCRYPTION_KEY ?? '';
  public ENCRYPTION_SALT = process.env.ENCRYPTION_SALT ?? '';
  public ENCRYPTION_ALGO = process.env.ENCRYPTION_ALGO ?? '';
  public SELF_API_URL = process.env.SELF_API_URL ?? '';

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, this.displayWelcomeMessage);
    this.router.post(`/token`, this.getAccessToken);
    this.router.delete(`/token`, this.removeAccessToken);
    this.router.post('/encrypt', this.encryptFile);
    this.router.post('/decrypt', this.decryptFile);
    this.router.post('/upload', this.uploadFile);
    this.router.post('/download', this.downloadFile);
    
  }

  private displayWelcomeMessage = async (
    _: express.Request,
    response: express.Response,
  ): Promise<void> => {
    response.send(`Welcome to the Fanstop backend server! Directly calling me isn't fun; so head to https://fanstop-datadao-frontend.vercel.app/ to explore more 🚀`);
  }

  private getAccessToken = async (
    request: express.Request,
    response: express.Response
  ) => {
    const { nonce, signature, walletPublicKey, walletPublicAddress } =
      request.body;
    const tokenResponse = await this.authnft.getToken({
      nonce,
      signature,
      walletPublicKey,
      walletPublicAddress,
    });
    if (tokenResponse.code === 200) {
      const data = tokenResponse.data as GetTokenResponseSuccess;
      response
        .cookie('Authorization', data.accessToken, { sameSite: 'none', secure: true, httpOnly: true })
        .send(tokenResponse.data);
      return;
    }
    response.status(tokenResponse.code).send(tokenResponse.data);
  };

  private removeAccessToken = async (
    _: express.Request,
    response: express.Response
  ) => {
    response.cookie('Authorization', 'none', {
        expires: new Date(Date.now() + 5 * 1000),
        httpOnly: true,
    })
    response.status(200).json({ success: true, message: 'User logged out successfully' })
}


  private encryptFile = async (
    req : express.Request,
    res: express.Response
  ) => {
    if (!req.files || !checkFile(req.files)) {
      return res.status(400).end("Please upload correct file");
    }
    if (!checkParams(req.body)) {
      return res.status(400).end("Please provide correct parameters");
    }
    const file: UploadedFile = req.files.file as UploadedFile;
    const encrypted = cryptFileWithSalt(file, false, req.body);
    setupHeaders(res, file);
    res.end(encrypted);
  };

  private decryptFile = async (
    req : express.Request,
    res: express.Response
  ) => {
    if (!req.files || !checkFile(req.files)) {
      return res.status(400).end("Please upload correct file");
    }
    if (!checkParams(req.body)) {
      return res.status(400).end("Please provide correct parameters");
    }
    const file: UploadedFile = req.files.file as UploadedFile;
    const decrypted = cryptFileWithSalt(file, true, req.body);
    setupHeaders(res, file);
    res.end(decrypted);
  };

  private uploadFile = async (
    req : express.Request,
    res: express.Response
  ) => {
  };
  
  private downloadFile = async (
    req : express.Request,
    res: express.Response
  ) => {
    try{
      const { filename } = req.body;
      
      const resp = await axios({
        method: 'post',
        url: `${this.CHAINSAFE_BUCKET_URL}/download`,
        responseType: 'stream' as ResponseType,
        headers: { 
          'Authorization': `Bearer ${this.CHAINSAFE_KEY_SECRET}`,
          'Content-Type': 'application/json'
        },
        data : JSON.stringify({
          "path": `encrypted_${filename}`
        })
      });
      
      let formdata = new FormData();
      formdata.append('key', this.ENCRYPTION_KEY);
      formdata.append('salt', this.ENCRYPTION_SALT);
      formdata.append('algo', this.ENCRYPTION_ALGO);
      formdata.append('file', resp.data);

      const resp2 = await axios({
        method: 'post',
        url: `${this.SELF_API_URL}/decrypt`,
        responseType: 'stream' as ResponseType,
        headers: { 
          ...formdata.getHeaders()
        },
        data : formdata
      })
      resp2.data.pipe(res)
    } catch (error) {
      return res.sendStatus(400);
    }
  };
}

export default AuthenticationController;
