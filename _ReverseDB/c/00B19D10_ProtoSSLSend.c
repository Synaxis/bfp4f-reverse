int __cdecl ProtoSSLSend(ProtoSSLRefT *pState, char *buf, int len)
{
  int v3; // esi
  signed int v4; // ebx
  int result; // eax

  v3 = len;
  v4 = -1;
  if ( len < 0 )
    v3 = strlen(buf);
  if ( pState->iState == 30 )
  {
    v4 = 0;
    if ( !pState[1].pSock->iSendSize )
    {
      if ( v3 > 16000 )
        v3 = 16000;
      SendPacket(0, 0, (int)pState, 23, buf, v3);
      v4 = v3;
      ProtoSSLUpdate(pState);
    }
  }
  if ( pState->iState == 31 )
    result = SocketSend((int)pState->pSock, buf, v3, 0, 0, 0);
  else
    result = v4;
  return result;
}