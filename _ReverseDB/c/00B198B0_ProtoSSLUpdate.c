void __cdecl ProtoSSLUpdate(ProtoSSLRefT *a1)
{
  ProtoSSLRefT *v1; // edi
  SocketT *pSecure; // esi
  int v3; // ecx
  unsigned int v4; // eax
  int v5; // eax
  bool v6; // sf
  signed int v7; // eax
  signed int iXfer; // ebp
  signed int v9; // eax
  int v10; // ecx
  int v11; // eax
  int v12; // eax
  signed int v13; // eax
  int v14; // eax
  bool v15; // sf
  signed int v16; // eax
  int v17; // ecx
  int v18; // eax
  signed int v19; // eax
  bool v20; // sf
  int v21; // eax
  char v22; // cl
  int v23; // eax
  _BYTE *v24; // eax
  signed int v25; // eax
  unsigned __int8 *v26; // eax
  _BYTE *v27; // eax
  _DWORD *v28; // eax

  v1 = a1;
  pSecure = a1[1].pSock;
  if ( a1->iState == 1 && (*(int (__cdecl **)(_DWORD))(a1->pHost + 8))(a1->pHost) )
  {
    v3 = v1->pHost;
    if ( *(_DWORD *)(v3 + 4) )
    {
      v1->iState = 2;
      v4 = *(_DWORD *)(v3 + 4);
      v1->PeerAddr.sa_data[5] = v4;
      v4 >>= 8;
      v1->PeerAddr.sa_data[4] = v4;
      v4 >>= 8;
      v1->PeerAddr.sa_data[3] = v4;
      v1->PeerAddr.sa_data[2] = BYTE1(v4);
    }
    else
    {
      v1->iState = 4097;
    }
    (*(void (__cdecl **)(int))(v3 + 12))(v3);
    v1->pHost = 0;
  }
  if ( v1->iState == 2 )
  {
    if ( SocketConnect((int)v1->pSock, (int)&v1->PeerAddr, 16) )
    {
      v1->iState = 4098;
      v1->iClosed = 1;
    }
    else
    {
      v1->iState = 3;
    }
  }
  if ( v1->iState == 3 )
  {
    v5 = SocketInfo((int)v1->pSock, 'stat', 0, 0, 0);
    v6 = v5 < 0;
    if ( v5 > 0 )
    {
      v1->iState = pSecure != 0 ? 20 : 31;
      v1->iClosed = 0;
      v6 = v5 < 0;
    }
    if ( v6 )
    {
      v1->iState = 4098;
      v1->iClosed = 1;
    }
  }
  if ( v1->pSock )
  {
    do
    {
      v7 = v1->iState;
      if ( v7 < 20 || v7 > 30 )
        return;
      iXfer = 0;
      if ( pSecure->iSendProg == pSecure->iSendSize )
      {
        switch ( v7 )
        {
          case 20:
            v9 = ProtoSSLUpdateSendClientHello((int)v1);
            break;
          case 22:
            v9 = ProtoSSLUpdateSendClientKey((int)v1);
            break;
          case 23:
            v9 = ProtoSSLUpdateSendChange((int)v1);
            break;
          case 24:
            v9 = ProtoSSLUpdateSendClientFinish((int)v1);
            break;
          default:
            goto LABEL_29;
        }
        v1->iState = v9;
      }
LABEL_29:
      v10 = pSecure->iSendProg;
      v11 = pSecure->iSendSize;
      if ( v10 < v11 )
      {
        v12 = SocketSend((int)v1->pSock, &pSecure->gap24[v10 + 4672], v11 - v10, 0, 0, 0);
        if ( v12 > 0 )
        {
          pSecure->iSendProg += v12;
          iXfer = 1;
        }
        if ( pSecure->iSendProg == pSecure->iSendSize )
        {
          pSecure->iSendSize = 0;
          pSecure->iSendProg = 0;
        }
      }
      v13 = pSecure->iRecvSize;
      if ( v13 < 5 )
      {
        v14 = SocketRecv((int)v1->pSock, &pSecure->RecvData[v13], 5 - v13, 0, 0, 0);
        v15 = v14 < 0;
        if ( v14 > 0 )
        {
          pSecure->iRecvSize += v14;
          pSecure->iRecvProg = pSecure->iRecvSize;
          v15 = v14 < 0;
        }
        if ( v15 )
        {
          if ( v1->iState < 30 )
            v1->iState = 4102;
          v1->iClosed = 1;
        }
      }
      v16 = pSecure->iRecvSize;
      if ( v16 < 5 )
        return;
      if ( v16 == 5 )
      {
        if ( pSecure->RecvData[1] != 3 || pSecure->RecvData[2] )
        {
          pSecure->RecvData[3] = 0;
          pSecure->RecvData[4] = 0;
        }
        pSecure->iRecvSize += (unsigned __int8)pSecure->RecvData[4] | ((unsigned __int8)pSecure->RecvData[3] << 8);
        if ( pSecure->iRecvSize > 17408 )
        {
          v1->iClosed = 1;
          pSecure->iRecvDone = 0;
          pSecure->iRecvBase = 0;
          pSecure->iRecvSize = 0;
          pSecure->iRecvProg = 0;
          v1->iState = 4103;
        }
      }
      v17 = pSecure->iRecvProg;
      v18 = pSecure->iRecvSize;
      if ( v17 < v18 )
      {
        v19 = SocketRecv((int)v1->pSock, &pSecure->RecvData[v17], v18 - v17, 0, 0, 0);
        v20 = v19 < 0;
        if ( v19 > 0 )
        {
          pSecure->iRecvProg += v19;
          iXfer = 1;
          if ( pSecure->iRecvProg == pSecure->iRecvSize )
            v19 = RecvPacket((int)v1);
          v20 = v19 < 0;
        }
        if ( v20 )
        {
          if ( v1->iState < 30 )
            v1->iState = 4102;
          v1->iClosed = 1;
        }
      }
      v21 = pSecure->iRecvSize;
      if ( pSecure->iRecvProg == v21 && pSecure->iRecvBase < v21 )
      {
        v22 = pSecure->RecvData[0];
        if ( v22 == 21 )
        {
          if ( pSecure->RecvData[5] != 1 || pSecure->RecvData[6] )
          {
            v1->iState = 4102;
          }
          else
          {
            if ( v1->iState < 30 )
              v1->iState = 4102;
            v1->iClosed = 1;
            pSecure->iRecvDone = 0;
            pSecure->iRecvBase = 0;
            pSecure->iRecvSize = 0;
            pSecure->iRecvProg = 0;
          }
          goto LABEL_84;
        }
        v23 = v1->iState;
        switch ( v23 )
        {
          case 21:
            v24 = (_BYTE *)RecvHandshake((int)v1, 2);
            if ( v24 )
            {
              v25 = ProtoSSLUpdateRecvServerHello(v24, (int)v1);
            }
            else
            {
              v26 = (unsigned __int8 *)RecvHandshake((int)v1, 11);
              if ( v26 )
              {
                v25 = ProtoSSLUpdateRecvServerCert(v26, (int)v1);
              }
              else
              {
                v27 = (_BYTE *)RecvHandshake((int)v1, 12);
                if ( !v27 )
                {
                  if ( RecvHandshake((int)v1, 13) )
                  {
                    LOWORD(a1) = 10497;
                    SendPacket(2u, &a1, (int)v1, 21, 0, 0);
                  }
                  else if ( RecvHandshake((int)v1, 14) )
                  {
                    v1->iState = 22;
                  }
                  break;
                }
                v25 = (unsigned __int8)(*v27 - 1) != 0 ? 4102 : 21;
              }
            }
LABEL_83:
            v1->iState = v25;
            break;
          case 25:
            if ( v22 == 20 )
            {
              v1->iState = ProtoSSLUpdateRecvChange((int)v1);
              pSecure->iRecvBase = pSecure->iRecvSize;
            }
            break;
          case 26:
            v28 = (_DWORD *)RecvHandshake((int)v1, 20);
            if ( v28 )
            {
              v25 = ProtoSSLUpdateRecvServerFinish((int)v1, v28);
              goto LABEL_83;
            }
            break;
        }
LABEL_84:
        if ( pSecure->iRecvBase >= pSecure->iRecvSize )
        {
          pSecure->iRecvDone = 0;
          pSecure->iRecvBase = 0;
          pSecure->iRecvSize = 0;
          pSecure->iRecvProg = 0;
        }
      }
    }
    while ( iXfer && v1->pSock );
  }
}