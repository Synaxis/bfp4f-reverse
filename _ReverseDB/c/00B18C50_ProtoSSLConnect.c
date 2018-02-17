int __cdecl ProtoSSLConnect(int pState, int iSecure, char *pAddr, int uAddr, __int16 iPort)
{
  int result; // eax
  int v6; // eax
  int v7; // ecx
  char *v8; // ebp
  char v9; // al
  unsigned int i; // edi
  const char *v11; // edi
  int v12; // eax
  char v13; // al
  int v14; // edx
  int v15; // ecx

  result = ResetState((ProtoSSLRefT *)pState, iSecure);
  if ( !result )
  {
    v6 = SocketOpen(2, 1, 0);
    *(_DWORD *)pState = v6;
    if ( v6 )
    {
      v7 = *(_DWORD *)(pState + 752);
      if ( v7 )
        sub_B09BE0(v6, 'rbuf', v7, 0, 0);
      if ( *(_BYTE *)(pState + 761) )
        sub_B09BE0(*(_DWORD *)pState, 'xins', 1, 0, 0);
      *(_WORD *)(pState + 272) = 2;
      *(_WORD *)(pState + 274) = 0;
      *(_DWORD *)(pState + 276) = 0;
      *(_DWORD *)(pState + 280) = 0;
      *(_DWORD *)(pState + 284) = 0;
      *(_BYTE *)(pState + 762) = 0;
      memset((void *)(pState + 300), 0, 0x1C0u);
      v8 = pAddr;
      if ( !pAddr )
        v8 = byte_F39361;
      v9 = *v8;
      for ( i = 0; v9; v9 = v8[i++ + 1] )
      {
        if ( v9 == 58 )
          break;
        if ( i >= 0xFF )
          break;
        *(_BYTE *)(i + pState + 16) = v9;
      }
      *(_BYTE *)(i + pState + 16) = 0;
      SockaddrInSetAddrText(pState + 272, pState + 16);
      if ( !(*(unsigned __int8 *)(pState + 279) | ((*(unsigned __int8 *)(pState + 278) | ((*(unsigned __int8 *)(pState + 277) | (*(unsigned __int8 *)(pState + 276) << 8)) << 8)) << 8)) )
      {
        *(_BYTE *)(pState + 279) = uAddr;
        *(_BYTE *)(pState + 278) = BYTE1(uAddr);
        *(_BYTE *)(pState + 277) = BYTE2(uAddr);
        *(_BYTE *)(pState + 276) = HIBYTE(uAddr);
      }
      if ( v8[i] == ':' )
      {
        v11 = &v8[i + 1];
        v12 = atoi(v11);
        *(_BYTE *)(pState + 274) = BYTE1(v12);
        v13 = atoi(v11);
      }
      else
      {
        v13 = iPort;
        *(_BYTE *)(pState + 274) = HIBYTE(iPort);
      }
      v14 = *(unsigned __int8 *)(pState + 276);
      v15 = *(unsigned __int8 *)(pState + 278);
      *(_BYTE *)(pState + 275) = v13;
      if ( *(unsigned __int8 *)(pState + 279) | ((v15 | ((*(unsigned __int8 *)(pState + 277) | (v14 << 8)) << 8)) << 8) )
      {
        *(_DWORD *)(pState + 288) = 2;
      }
      else
      {
        *(_DWORD *)(pState + 4) = SocketLookup((char *)(pState + 16), 0x7530u);
        *(_DWORD *)(pState + 288) = 1;
      }
      result = 0;
    }
    else
    {
      result = -9;
    }
  }
  return result;
}