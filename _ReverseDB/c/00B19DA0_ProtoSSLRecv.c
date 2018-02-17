int __cdecl ProtoSSLRecv(ProtoSSLRefT *pState, void *Dst, int len)
{
  SocketT *v3; // esi
  int v4; // edi
  int v5; // eax
  signed int v6; // eax
  bool v7; // zf
  signed int v8; // ecx
  int result; // eax

  v3 = pState[1].pSock;
  v4 = -1;
  if ( pState->iState == 30 )
  {
    v5 = v3->iRecvProg;
    v4 = 0;
    if ( !v5 || v5 != v3->iRecvSize )
      ProtoSSLUpdate(pState);
    v6 = v3->iRecvSize;
    if ( v6 < 5 || (v7 = v3->iRecvProg == v6, v3->iRecvProg < v6) )
    {
      if ( pState->iClosed )
      {
        v4 = -1;
        goto LABEL_19;
      }
      v7 = v3->iRecvProg == v6;
    }
    if ( v7 )
    {
      v8 = v3->iRecvBase;
      if ( v8 < v6 && v3->RecvData[0] == 23 && v3->iRecvDone )
      {
        v4 = v6 - v8;
        if ( v6 - v8 > len )
          v4 = len;
        memcpy(Dst, &v3->RecvData[v8], v4);
        v3->iRecvBase += v4;
        if ( v3->iRecvBase >= v3->iRecvSize && v3->iRecvDone )
        {
          v3->iRecvDone = 0;
          v3->iRecvBase = 0;
          v3->iRecvSize = 0;
          v3->iRecvProg = 0;
        }
      }
    }
  }
LABEL_19:
  if ( pState->iState == 31 )
    v4 = SocketRecv((int)pState->pSock, (char *)Dst, len, 0, 0, 0);
  result = v4;
  if ( v4 > 0 && v4 < len )
    *((_BYTE *)Dst + v4) = 0;
  return result;
}